import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository.js";
import { serializeDocument } from "../utils/mongoIds.js";
import { httpError } from "../utils/httpError.js";

function authUser(user) {
  const serialized = serializeDocument(user);
  if (!serialized) return null;

  const { passwordHash, ...safeUser } = serialized;
  return safeUser;
}

function signToken(user, jwtSecret) {
  return jwt.sign(
    {
      sub: String(user._id),
      username: user.username,
      role: user.role
    },
    jwtSecret,
    { expiresIn: "7d" }
  );
}

export function createAuthService({ db, jwtSecret }) {
  return {
    async register(input) {
      const username = String(input.username || "").trim().toLowerCase();
      const password = String(input.password || "");

      if (!username) throw httpError(400, "Username is required");
      if (password.length < 6) throw httpError(400, "Password must contain at least 6 characters");

      const existingUser = await userRepository.findByUsername(db, username);
      if (existingUser) throw httpError(409, "Username already exists");

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await userRepository.create(db, {
        ...input,
        username,
        passwordHash
      });

      return { user };
    },

    async login(input) {
      const username = String(input.username || "").trim().toLowerCase();
      const password = String(input.password || "");
      const user = await userRepository.findByUsername(db, username);

      if (!user) throw httpError(401, "Invalid username or password");

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) throw httpError(401, "Invalid username or password");

      return {
        user: authUser(user),
        token: signToken(user, jwtSecret)
      };
    },

    verifyToken(token) {
      try {
        return jwt.verify(token, jwtSecret);
      } catch {
        throw httpError(401, "Invalid or expired token");
      }
    }
  };
}

