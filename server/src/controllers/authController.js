export function createAuthController(authService) {
  return {
    async register(req, res) {
      const result = await authService.register(req.body);
      res.status(201).json({ success: true, ...result });
    },

    async login(req, res) {
      const result = await authService.login(req.body);
      res.json({ success: true, ...result });
    },

    me(req, res) {
      res.json({ success: true, user: req.user });
    }
  };
}
