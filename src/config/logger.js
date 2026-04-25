const LEVELS = {
  info: "INFO",
  warn: "WARN",
  error: "ERROR",
};

function write(level, message, meta) {
  const ts = new Date().toISOString();
  const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
  console.log(`[${ts}] ${LEVELS[level]} ${message}${suffix}`);
}

const logger = {
  info(message, meta) {
    write("info", message, meta);
  },
  warn(message, meta) {
    write("warn", message, meta);
  },
  error(message, meta) {
    write("error", message, meta);
  },
};

export default logger;
