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
exports.LearningPath = void 0;
const typeorm_1 = require("typeorm");
let LearningPath = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('learning_paths')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _pathId_decorators;
    let _pathId_initializers = [];
    let _pathId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _targetDate_decorators;
    let _targetDate_initializers = [];
    let _targetDate_extraInitializers = [];
    let _currentPhase_decorators;
    let _currentPhase_initializers = [];
    let _currentPhase_extraInitializers = [];
    let _milestones_decorators;
    let _milestones_initializers = [];
    let _milestones_extraInitializers = [];
    let _adaptations_decorators;
    let _adaptations_initializers = [];
    let _adaptations_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var LearningPath = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _pathId_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
            _userId_decorators = [(0, typeorm_1.Column)()];
            _startDate_decorators = [(0, typeorm_1.Column)({ type: 'date' })];
            _targetDate_decorators = [(0, typeorm_1.Column)({ type: 'date' })];
            _currentPhase_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
            _milestones_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
            _adaptations_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
            _status_decorators = [(0, typeorm_1.Column)()];
            _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
            _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
            __esDecorate(null, null, _pathId_decorators, { kind: "field", name: "pathId", static: false, private: false, access: { has: obj => "pathId" in obj, get: obj => obj.pathId, set: (obj, value) => { obj.pathId = value; } }, metadata: _metadata }, _pathId_initializers, _pathId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _targetDate_decorators, { kind: "field", name: "targetDate", static: false, private: false, access: { has: obj => "targetDate" in obj, get: obj => obj.targetDate, set: (obj, value) => { obj.targetDate = value; } }, metadata: _metadata }, _targetDate_initializers, _targetDate_extraInitializers);
            __esDecorate(null, null, _currentPhase_decorators, { kind: "field", name: "currentPhase", static: false, private: false, access: { has: obj => "currentPhase" in obj, get: obj => obj.currentPhase, set: (obj, value) => { obj.currentPhase = value; } }, metadata: _metadata }, _currentPhase_initializers, _currentPhase_extraInitializers);
            __esDecorate(null, null, _milestones_decorators, { kind: "field", name: "milestones", static: false, private: false, access: { has: obj => "milestones" in obj, get: obj => obj.milestones, set: (obj, value) => { obj.milestones = value; } }, metadata: _metadata }, _milestones_initializers, _milestones_extraInitializers);
            __esDecorate(null, null, _adaptations_decorators, { kind: "field", name: "adaptations", static: false, private: false, access: { has: obj => "adaptations" in obj, get: obj => obj.adaptations, set: (obj, value) => { obj.adaptations = value; } }, metadata: _metadata }, _adaptations_initializers, _adaptations_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LearningPath = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        pathId = __runInitializers(this, _pathId_initializers, void 0);
        userId = (__runInitializers(this, _pathId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
        startDate = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
        targetDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _targetDate_initializers, void 0));
        currentPhase = (__runInitializers(this, _targetDate_extraInitializers), __runInitializers(this, _currentPhase_initializers, void 0));
        milestones = (__runInitializers(this, _currentPhase_extraInitializers), __runInitializers(this, _milestones_initializers, void 0));
        adaptations = (__runInitializers(this, _milestones_extraInitializers), __runInitializers(this, _adaptations_initializers, void 0));
        status = (__runInitializers(this, _adaptations_extraInitializers), __runInitializers(this, _status_initializers, void 0)); // 'active', 'completed', 'paused'
        createdAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    return LearningPath = _classThis;
})();
exports.LearningPath = LearningPath;
//# sourceMappingURL=LearningPath.js.map