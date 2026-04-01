"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTracing = initTracing;
exports.createTraceSpan = createTraceSpan;
function initTracing(options) {
    if (!options.enabled && process.env.NODE_ENV === 'production') {
        options.enabled = true;
    }
    if (!options.enabled) {
        console.log(`[${options.serviceName}] Tracing disabled`);
        return;
    }
    console.log(`[${options.serviceName}] Tracing enabled, endpoint: ${options.jaegerEndpoint || 'not configured'}`);
}
function createTraceSpan(name) {
    // Placeholder for tracing - actual implementation requires full OpenTelemetry setup
    console.log(`[TRACE] ${name}`);
}
//# sourceMappingURL=tracing.js.map