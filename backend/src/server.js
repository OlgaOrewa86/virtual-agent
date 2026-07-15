// src/server.js

import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import logger from "./utils/logger.js";
import { getEmbedder } from "./intents/embedder.js";

const PORT = process.env.PORT || 3001;
const IS_CI = process.env.CI === "true";

if (!IS_CI) {
  await getEmbedder();
  logger.info("MiniLM embedder loaded and ready.");
} else {
  logger.info("CI mode: skipping embedder initialization.");
}


app.listen(PORT, () => {
  logger.info(`Virtual agent server running on port ${PORT}`);
});
