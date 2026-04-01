"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorPattern = void 0;
const typeorm_1 = require("typeorm");
let ErrorPattern = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('error_patterns')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _patternId_decorators;
    let _patternId_initializers = [];
    let _patternId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _errorType_decorators;
    let _errorType_initializers = [];
    let _errorType_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _occurrences_decorators;
    let _occurrences_initializers = [];
    let _occurrences_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _firstDetected_decorators;
    let _firstDetected_initializers = [];
    let _firstDetected_extraInitializers = [];
    let _lastDetected_decorators;
    let _lastDetected_initializers = [];
    let _lastDetected_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ErrorPattern = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _patternId_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
            _userId_decorators = [(0, typeorm_1.Column)()];
            _errorType_decorators = [(0, typeorm_1.Column)()];
            _category_decorators = [(0, typeorm_1.Column)()];
            _description_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
            _occurrences_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
            _frequency_decorators = [(0, typeorm_1.Column)()];
            _severity_decorators = [(0, typeorm_1.Column)()];
            _status_decorators = [(0, typeorm_1.Column)()];
            _firstDetected_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
            _lastDetected_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
            _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
            _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
            __esDecorate(null, null, _patternId_decorators, { kind: "field", name: "patternId", static: false, private: false, access: { has: obj => "patternId" in obj, get: obj => obj.patternId, set: (obj, value) => { obj.patternId = value; } }, metadata: _metadata }, _patternId_initializers, _patternId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _errorType_decorators, { kind: "field", name: "errorType", static: false, private: false, access: { has: obj => "errorType" in obj, get: obj => obj.errorType, set: (obj, value) => { obj.errorType = value; } }, metadata: _metadata }, _errorType_initializers, _errorType_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _occurrences_decorators, { kind: "field", name: "occurrences", static: false, private: false, access: { has: obj => "occurrences" in obj, get: obj => obj.occurrences, set: (obj, value) => { obj.occurrences = value; } }, metadata: _metadata }, _occurrences_initializers, _occurrences_extraInitializers);
            __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _firstDetected_decorators, { kind: "field", name: "firstDetected", static: false, private: false, access: { has: obj => "firstDetected" in obj, get: obj => obj.firstDetected, set: (obj, value) => { obj.firstDetected = value; } }, metadata: _metadata }, _firstDetected_initializers, _firstDetected_extraInitializers);
            __esDecorate(null, null, _lastDetected_decorators, { kind: "field", name: "lastDetected", static: false, private: false, access: { has: obj => "lastDetected" in obj, get: obj => obj.lastDetected, set: (obj, value) => { obj.lastDetected = value; } }, metadata: _metadata }, _lastDetected_initializers, _lastDetected_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ErrorPattern = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        patternId = __runInitializers(this, _patternId_initializers, void 0);
        userId = (__runInitializers(this, _patternId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
        errorType = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _errorType_initializers, void 0));
        category = (__runInitializers(this, _errorType_extraInitializers), __runInitializers(this, _category_initializers, void 0));
        description = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _description_initializers, void 0));
        occurrences = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _occurrences_initializers, void 0));
        frequency = (__runInitializers(this, _occurrences_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
        severity = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
        status = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _status_initializers, void 0)); // 'active', 'improving', 'resolved'
        firstDetected = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _firstDetected_initializers, void 0));
        lastDetected = (__runInitializers(this, _firstDetected_extraInitializers), __runInitializers(this, _lastDetected_initializers, void 0));
        createdAt = (__runInitializers(this, _lastDetected_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    return ErrorPattern = _classThis;
})();
exports.ErrorPattern = ErrorPattern;
//# sourceMappingURL=ErrorPattern.js.map