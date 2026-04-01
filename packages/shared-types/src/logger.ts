import pino, { Logger } from 'pino';

export interface LoggerOptions {
  name: string;
  level?: string;
  prettyPrint?: boolean;
}

export function createLogger(options: LoggerOptions): Logger {
  return pino({
    name: options.name,
    level: options.level || process.env.LOG_LEVEL || 'info',
    transport: options.prettyPrint
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
    formatters: {
      bindings: (bindings: Record<string, unknown>) => ({
        service: options.name,
        ...bindings,
      }),
    },
  });
}

export const logger = createLogger({
  name: 'tingwu',
  prettyPrint: process.env.NODE_ENV !== 'production',
});

export default logger;
