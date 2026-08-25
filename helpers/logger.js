const LOG_LEVEL = process.env.LOG_LEVEL || "info";

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

const formatMessage = (level, message, ...args) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  return args.length > 0 ? [prefix, message, ...args] : [prefix, message];
};

const logger = {
  error(message, ...args) {
    if (LEVELS[LOG_LEVEL] >= LEVELS.error) {
      console.error(...formatMessage("error", message, ...args));
    }
  },

  warn(message, ...args) {
    if (LEVELS[LOG_LEVEL] >= LEVELS.warn) {
      console.warn(...formatMessage("warn", message, ...args));
    }
  },

  info(message, ...args) {
    if (LEVELS[LOG_LEVEL] >= LEVELS.info) {
      console.log(...formatMessage("info", message, ...args));
    }
  },

  debug(message, ...args) {
    if (LEVELS[LOG_LEVEL] >= LEVELS.debug) {
      console.log(...formatMessage("debug", message, ...args));
    }
  },
};

module.exports = logger;
