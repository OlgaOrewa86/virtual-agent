// src/intents/nluLogger.js
import logger from "../utils/logger.js";

export function logNLU({
  message,
  ruleIntent,
  ruleScore,
  semanticIntent,
  semanticScore,
  finalIntent,
  finalConfidence
}) {
  logger.info(
    `NLU | message="${message}" | ruleIntent=${ruleIntent} (${ruleScore}) | semanticIntent=${semanticIntent} (${semanticScore.toFixed(
      3
    )}) | finalIntent=${finalIntent} | confidence=${finalConfidence}`
  );
}
