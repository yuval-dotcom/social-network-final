export function getHealth(req, res) {
  res.json({
    success: true,
    app: "StudyCircle",
    status: "ok"
  });
}
