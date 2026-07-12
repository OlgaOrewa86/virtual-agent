// src/routes/routingUiRouter.js
import express from "express";

const router = express.Router();

// Serve the dev-only routing UI
router.use("/", express.static("./src/routing"));

export default router;
