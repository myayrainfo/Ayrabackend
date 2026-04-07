import app from "./app.js";
import env from "./config/env.js";
import connectDatabase from "./config/database.js";
import logger from "./config/logger.js";

async function startServer() {
  await connectDatabase();

  const server = app.listen(env.port, () => {
    logger.info(`AYRA ERP unified backend running on http://localhost:${env.port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      logger.error(`Port ${env.port} is already in use.`);
      process.exit(1);
    }

    logger.error(error);
    process.exit(1);
  });
}

startServer().catch((error) => {
  logger.error(error);
  process.exit(1);
});


