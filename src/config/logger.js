import winston from "winston";

const { combine, timestamp, colorize, errors, printf, json } = winston.format;

const consoleFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} ${level}: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  defaultMeta: { service: "ayra-erp-backend" },
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? combine(timestamp(), errors({ stack: true }), json())
          : combine(colorize(), timestamp(), errors({ stack: true }), consoleFormat),
    }),
  ],
});

export default logger;


