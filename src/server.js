import startServer from "./bootstrap/startServer.js";
import logger from "./config/logger.js";

startServer().catch((error) => {
  logger.error(error.message, { stack: error.stack });
  process.exit(1);
});
