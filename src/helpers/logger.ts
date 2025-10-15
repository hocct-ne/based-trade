import pino from "pino";

const logger = pino({
  level: "info",
  browser: {
    asObject: true,
  },
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export { logger };
