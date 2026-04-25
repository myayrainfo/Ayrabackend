import { createServer } from "node:http";

import app from "../app.js";
import env from "../config/env.js";
import logger from "../config/logger.js";
import connectDatabase from "../core/database/connection.js";

export default async function startServer() {
  await connectDatabase();

  const server = createServer(app);

  await new Promise((resolve, reject) => {
    const handleError = (error) => {
      server.off("listening", handleListening);
      reject(error);
    };

    const handleListening = () => {
      server.off("error", handleError);
      logger.info(`AYRA Education API running on http://localhost:${env.port}`);
      resolve();
    };

    server.once("error", handleError);
    server.once("listening", handleListening);
    server.listen(env.port);
  });

  server.on("error", (error) => {
    logger.error(error.message, { code: error.code });
  });

  return server;
}
