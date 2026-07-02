// src/server.js
import app from "./app.js";
import logger from "./utils/logger.js";
import { getEmbedder } from "./intents/embedder.js";

const PORT = process.env.PORT || 3001;

await getEmbedder();
logger.info("MiniLM embedder loaded and ready.");

app.listen(PORT, () => {
  logger.info(`Virtual agent server running on port ${PORT}`);
});
