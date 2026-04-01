import { Logger } from 'pino';
export interface LoggerOptions {
    name: string;
    level?: string;
    prettyPrint?: boolean;
}
export declare function createLogger(options: LoggerOptions): Logger;
export declare const logger: Logger;
export default logger;
//# sourceMappingURL=logger.d.ts.map