export function createAuthController(authService) {
  return {
    async register(req, res, next) {
      try {
        const result = await authService.register(req.body);
        res.status(201).json({ success: true, ...result });
      } catch (error) {
        next(error);
      }
    },

    async login(req, res, next) {
      try {
        const result = await authService.login(req.body);
        res.json({ success: true, ...result });
      } catch (error) {
        next(error);
      }
    },

    me(req, res) {
      res.json({ success: true, user: req.user });
    }
  };
}

