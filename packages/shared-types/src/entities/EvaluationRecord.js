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
exports.EvaluationRecord = void 0;
const typeorm_1 = require("typeorm");
let EvaluationRecord = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('evaluation_records')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _evaluationId_decorators;
    let _evaluationId_initializers = [];
    let _evaluationId_extraInitializers = [];
    let _sessionId_decorators;
    let _sessionId_initializers = [];
    let _sessionId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _exerciseId_decorators;
    let _exerciseId_initializers = [];
    let _exerciseId_extraInitializers = [];
    let _recordingId_decorators;
    let _recordingId_initializers = [];
    let _recordingId_extraInitializers = [];
    let _overallScore_decorators;
    let _overallScore_initializers = [];
    let _overallScore_extraInitializers = [];
    let _dimensionScores_decorators;
    let _dimensionScores_initializers = [];
    let _dimensionScores_extraInitializers = [];
    let _transcript_decorators;
    let _transcript_initializers = [];
    let _transcript_extraInitializers = [];
    let _errors_decorators;
    let _errors_initializers = [];
    let _errors_extraInitializers = [];
    let _feedback_decorators;
    let _feedback_initializers = [];
    let _feedback_extraInitializers = [];
    let _evaluatedAt_decorators;
    let _evaluatedAt_initializers = [];
    let _evaluatedAt_extraInitializers = [];
    let _evaluationDuration_decorators;
    let _evaluationDuration_initializers = [];
    let _evaluationDuration_extraInitializers = [];
    let _modelVersions_decorators;
    let _modelVersions_initializers = [];
    let _modelVersions_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var EvaluationRecord = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _evaluationId_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
            _sessionId_decorators = [(0, typeorm_1.Column)()];
            _userId_decorators = [(0, typeorm_1.Column)()];
            _exerciseId_decorators = [(0, typeorm_1.Column)()];
            _recordingId_decorators = [(0, typeorm_1.Column)({ nullable: true })];
            _overallScore_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 })];
            _dimensionScores_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
            _transcript_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
            _errors_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
            _feedback_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
            _evaluatedAt_decorators = [(0, typeorm_1.Column)({ type: 'timestamp' })];
            _evaluationDuration_decorators = [(0, typeorm_1.Column)({ type: 'integer', nullable: true })];
            _modelVersions_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
            _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
            _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
            __esDecorate(null, null, _evaluationId_decorators, { kind: "field", name: "evaluationId", static: false, private: false, access: { has: obj => "evaluationId" in obj, get: obj => obj.evaluationId, set: (obj, value) => { obj.evaluationId = value; } }, metadata: _metadata }, _evaluationId_initializers, _evaluationId_extraInitializers);
            __esDecorate(null, null, _sessionId_decorators, { kind: "field", name: "sessionId", static: false, private: false, access: { has: obj => "sessionId" in obj, get: obj => obj.sessionId, set: (obj, value) => { obj.sessionId = value; } }, metadata: _metadata }, _sessionId_initializers, _sessionId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _exerciseId_decorators, { kind: "field", name: "exerciseId", static: false, private: false, access: { has: obj => "exerciseId" in obj, get: obj => obj.exerciseId, set: (obj, value) => { obj.exerciseId = value; } }, metadata: _metadata }, _exerciseId_initializers, _exerciseId_extraInitializers);
            __esDecorate(null, null, _recordingId_decorators, { kind: "field", name: "recordingId", static: false, private: false, access: { has: obj => "recordingId" in obj, get: obj => obj.recordingId, set: (obj, value) => { obj.recordingId = value; } }, metadata: _metadata }, _recordingId_initializers, _recordingId_extraInitializers);
            __esDecorate(null, null, _overallScore_decorators, { kind: "field", name: "overallScore", static: false, private: false, access: { has: obj => "overallScore" in obj, get: obj => obj.overallScore, set: (obj, value) => { obj.overallScore = value; } }, metadata: _metadata }, _overallScore_initializers, _overallScore_extraInitializers);
            __esDecorate(null, null, _dimensionScores_decorators, { kind: "field", name: "dimensionScores", static: false, private: false, access: { has: obj => "dimensionScores" in obj, get: obj => obj.dimensionScores, set: (obj, value) => { obj.dimensionScores = value; } }, metadata: _metadata }, _dimensionScores_initializers, _dimensionScores_extraInitializers);
            __esDecorate(null, null, _transcript_decorators, { kind: "field", name: "transcript", static: false, private: false, access: { has: obj => "transcript" in obj, get: obj => obj.transcript, set: (obj, value) => { obj.transcript = value; } }, metadata: _metadata }, _transcript_initializers, _transcript_extraInitializers);
            __esDecorate(null, null, _errors_decorators, { kind: "field", name: "errors", static: false, private: false, access: { has: obj => "errors" in obj, get: obj => obj.errors, set: (obj, value) => { obj.errors = value; } }, metadata: _metadata }, _errors_initializers, _errors_extraInitializers);
            __esDecorate(null, null, _feedback_decorators, { kind: "field", name: "feedback", static: false, private: false, access: { has: obj => "feedback" in obj, get: obj => obj.feedback, set: (obj, value) => { obj.feedback = value; } }, metadata: _metadata }, _feedback_initializers, _feedback_extraInitializers);
            __esDecorate(null, null, _evaluatedAt_decorators, { kind: "field", name: "evaluatedAt", static: false, private: false, access: { has: obj => "evaluatedAt" in obj, get: obj => obj.evaluatedAt, set: (obj, value) => { obj.evaluatedAt = value; } }, metadata: _metadata }, _evaluatedAt_initializers, _evaluatedAt_extraInitializers);
            __esDecorate(null, null, _evaluationDuration_decorators, { kind: "field", name: "evaluationDuration", static: false, private: false, access: { has: obj => "evaluationDuration" in obj, get: obj => obj.evaluationDuration, set: (obj, value) => { obj.evaluationDuration = value; } }, metadata: _metadata }, _evaluationDuration_initializers, _evaluationDuration_extraInitializers);
            __esDecorate(null, null, _modelVersions_decorators, { kind: "field", name: "modelVersions", static: false, private: false, access: { has: obj => "modelVersions" in obj, get: obj => obj.modelVersions, set: (obj, value) => { obj.modelVersions = value; } }, metadata: _metadata }, _modelVersions_initializers, _modelVersions_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            EvaluationRecord = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        evaluationId = __runInitializers(this, _evaluationId_initializers, void 0);
        sessionId = (__runInitializers(this, _evaluationId_extraInitializers), __runInitializers(this, _sessionId_initializers, void 0));
        userId = (__runInitializers(this, _sessionId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
        exerciseId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _exerciseId_initializers, void 0));
        recordingId = (__runInitializers(this, _exerciseId_extraInitializers), __runInitializers(this, _recordingId_initializers, void 0));
        overallScore = (__runInitializers(this, _recordingId_extraInitializers), __runInitializers(this, _overallScore_initializers, void 0));
        dimensionScores = (__runInitializers(this, _overallScore_extraInitializers), __runInitializers(this, _dimensionScores_initializers, void 0));
        transcript = (__runInitializers(this, _dimensionScores_extraInitializers), __runInitializers(this, _transcript_initializers, void 0));
        errors = (__runInitializers(this, _transcript_extraInitializers), __runInitializers(this, _errors_initializers, void 0));
        feedback = (__runInitializers(this, _errors_extraInitializers), __runInitializers(this, _feedback_initializers, void 0));
        evaluatedAt = (__runInitializers(this, _feedback_extraInitializers), __runInitializers(this, _evaluatedAt_initializers, void 0));
        evaluationDuration = (__runInitializers(this, _evaluatedAt_extraInitializers), __runInitializers(this, _evaluationDuration_initializers, void 0));
        modelVersions = (__runInitializers(this, _evaluationDuration_extraInitializers), __runInitializers(this, _modelVersions_initializers, void 0));
        createdAt = (__runInitializers(this, _modelVersions_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    return EvaluationRecord = _classThis;
})();
exports.EvaluationRecord = EvaluationRecord;
//# sourceMappingURL=EvaluationRecord.js.map