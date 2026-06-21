export function createAuthenticate(authService) {
  return function authenticate(req, res, next) {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      const error = new Error("Authentication token is required");
      error.status = 401;
      next(error);
      return;
    }

    try {
      req.user = authService.verifyToken(token);
      next();
    } catch (error) {
      next(error);
    }
  };
}

