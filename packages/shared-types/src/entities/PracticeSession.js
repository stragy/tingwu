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
exports.PracticeSession = void 0;
const typeorm_1 = require("typeorm");
let PracticeSession = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('practice_sessions')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _sessionId_decorators;
    let _sessionId_initializers = [];
    let _sessionId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _exerciseId_decorators;
    let _exerciseId_initializers = [];
    let _exerciseId_extraInitializers = [];
    let _exerciseType_decorators;
    let _exerciseType_initializers = [];
    let _exerciseType_extraInitializers = [];
    let _startTime_decorators;
    let _startTime_initializers = [];
    let _startTime_extraInitializers = [];
    let _endTime_decorators;
    let _endTime_initializers = [];
    let _endTime_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _recording_decorators;
    let _recording_initializers = [];
    let _recording_extraInitializers = [];
    let _evaluationId_decorators;
    let _evaluationId_initializers = [];
    let _evaluationId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var PracticeSession = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sessionId_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
            _userId_decorators = [(0, typeorm_1.Column)()];
            _exerciseId_decorators = [(0, typeorm_1.Column)()];
            _exerciseType_decorators = [(0, typeorm_1.Column)()];
            _startTime_decorators = [(0, typeorm_1.Column)({ type: 'timestamp' })];
            _endTime_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
            _status_decorators = [(0, typeorm_1.Column)()];
            _recording_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
            _evaluationId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
            _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
            _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
            __esDecorate(null, null, _sessionId_decorators, { kind: "field", name: "sessionId", static: false, private: false, access: { has: obj => "sessionId" in obj, get: obj => obj.sessionId, set: (obj, value) => { obj.sessionId = value; } }, metadata: _metadata }, _sessionId_initializers, _sessionId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _exerciseId_decorators, { kind: "field", name: "exerciseId", static: false, private: false, access: { has: obj => "exerciseId" in obj, get: obj => obj.exerciseId, set: (obj, value) => { obj.exerciseId = value; } }, metadata: _metadata }, _exerciseId_initializers, _exerciseId_extraInitializers);
            __esDecorate(null, null, _exerciseType_decorators, { kind: "field", name: "exerciseType", static: false, private: false, access: { has: obj => "exerciseType" in obj, get: obj => obj.exerciseType, set: (obj, value) => { obj.exerciseType = value; } }, metadata: _metadata }, _exerciseType_initializers, _exerciseType_extraInitializers);
            __esDecorate(null, null, _startTime_decorators, { kind: "field", name: "startTime", static: false, private: false, access: { has: obj => "startTime" in obj, get: obj => obj.startTime, set: (obj, value) => { obj.startTime = value; } }, metadata: _metadata }, _startTime_initializers, _startTime_extraInitializers);
            __esDecorate(null, null, _endTime_decorators, { kind: "field", name: "endTime", static: false, private: false, access: { has: obj => "endTime" in obj, get: obj => obj.endTime, set: (obj, value) => { obj.endTime = value; } }, metadata: _metadata }, _endTime_initializers, _endTime_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _recording_decorators, { kind: "field", name: "recording", static: false, private: false, access: { has: obj => "recording" in obj, get: obj => obj.recording, set: (obj, value) => { obj.recording = value; } }, metadata: _metadata }, _recording_initializers, _recording_extraInitializers);
            __esDecorate(null, null, _evaluationId_decorators, { kind: "field", name: "evaluationId", static: false, private: false, access: { has: obj => "evaluationId" in obj, get: obj => obj.evaluationId, set: (obj, value) => { obj.evaluationId = value; } }, metadata: _metadata }, _evaluationId_initializers, _evaluationId_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PracticeSession = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        sessionId = __runInitializers(this, _sessionId_initializers, void 0);
        userId = (__runInitializers(this, _sessionId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
        exerciseId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _exerciseId_initializers, void 0));
        exerciseType = (__runInitializers(this, _exerciseId_extraInitializers), __runInitializers(this, _exerciseType_initializers, void 0));
        startTime = (__runInitializers(this, _exerciseType_extraInitializers), __runInitializers(this, _startTime_initializers, void 0));
        endTime = (__runInitializers(this, _startTime_extraInitializers), __runInitializers(this, _endTime_initializers, void 0));
        status = (__runInitializers(this, _endTime_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        recording = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _recording_initializers, void 0));
        evaluationId = (__runInitializers(this, _recording_extraInitializers), __runInitializers(this, _evaluationId_initializers, void 0));
        createdAt = (__runInitializers(this, _evaluationId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    return PracticeSession = _classThis;
})();
exports.PracticeSession = PracticeSession;
//# sourceMappingURL=PracticeSession.js.map