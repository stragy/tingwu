export interface TracingOptions {
    serviceName: string;
    jaegerEndpoint?: string;
    enabled?: boolean;
}
export declare function initTracing(options: TracingOptions): void;
export declare function createTraceSpan(name: string): void;
//# sourceMappingURL=tracing.d.ts.map