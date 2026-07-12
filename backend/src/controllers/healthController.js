export function healthController(req, res) {
  res.json({
    status: "ok",
    message: "Virtual agent running"
  });
}
