"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.createLogger = createLogger;
const pino_1 = __importDefault(require("pino"));
function createLogger(options) {
    return (0, pino_1.default)({
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
            bindings: (bindings) => ({
                service: options.name,
                ...bindings,
            }),
        },
    });
}
exports.logger = createLogger({
    name: 'tingwu',
    prettyPrint: process.env.NODE_ENV !== 'production',
});
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map