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
exports.MockExamRecord = void 0;
const typeorm_1 = require("typeorm");
let MockExamRecord = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('mock_exam_records')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _examId_decorators;
    let _examId_initializers = [];
    let _examId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _examDate_decorators;
    let _examDate_initializers = [];
    let _examDate_extraInitializers = [];
    let _overallScore_decorators;
    let _overallScore_initializers = [];
    let _overallScore_extraInitializers = [];
    let _sectionScores_decorators;
    let _sectionScores_initializers = [];
    let _sectionScores_extraInitializers = [];
    let _sections_decorators;
    let _sections_initializers = [];
    let _sections_extraInitializers = [];
    let _ranking_decorators;
    let _ranking_initializers = [];
    let _ranking_extraInitializers = [];
    let _feedback_decorators;
    let _feedback_initializers = [];
    let _feedback_extraInitializers = [];
    let _comparisonToPrevious_decorators;
    let _comparisonToPrevious_initializers = [];
    let _comparisonToPrevious_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var MockExamRecord = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _examId_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
            _userId_decorators = [(0, typeorm_1.Column)()];
            _examDate_decorators = [(0, typeorm_1.Column)({ type: 'timestamp' })];
            _overallScore_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 })];
            _sectionScores_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
            _sections_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
            _ranking_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
            _feedback_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
            _comparisonToPrevious_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
            _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
            _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
            __esDecorate(null, null, _examId_decorators, { kind: "field", name: "examId", static: false, private: false, access: { has: obj => "examId" in obj, get: obj => obj.examId, set: (obj, value) => { obj.examId = value; } }, metadata: _metadata }, _examId_initializers, _examId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _examDate_decorators, { kind: "field", name: "examDate", static: false, private: false, access: { has: obj => "examDate" in obj, get: obj => obj.examDate, set: (obj, value) => { obj.examDate = value; } }, metadata: _metadata }, _examDate_initializers, _examDate_extraInitializers);
            __esDecorate(null, null, _overallScore_decorators, { kind: "field", name: "overallScore", static: false, private: false, access: { has: obj => "overallScore" in obj, get: obj => obj.overallScore, set: (obj, value) => { obj.overallScore = value; } }, metadata: _metadata }, _overallScore_initializers, _overallScore_extraInitializers);
            __esDecorate(null, null, _sectionScores_decorators, { kind: "field", name: "sectionScores", static: false, private: false, access: { has: obj => "sectionScores" in obj, get: obj => obj.sectionScores, set: (obj, value) => { obj.sectionScores = value; } }, metadata: _metadata }, _sectionScores_initializers, _sectionScores_extraInitializers);
            __esDecorate(null, null, _sections_decorators, { kind: "field", name: "sections", static: false, private: false, access: { has: obj => "sections" in obj, get: obj => obj.sections, set: (obj, value) => { obj.sections = value; } }, metadata: _metadata }, _sections_initializers, _sections_extraInitializers);
            __esDecorate(null, null, _ranking_decorators, { kind: "field", name: "ranking", static: false, private: false, access: { has: obj => "ranking" in obj, get: obj => obj.ranking, set: (obj, value) => { obj.ranking = value; } }, metadata: _metadata }, _ranking_initializers, _ranking_extraInitializers);
            __esDecorate(null, null, _feedback_decorators, { kind: "field", name: "feedback", static: false, private: false, access: { has: obj => "feedback" in obj, get: obj => obj.feedback, set: (obj, value) => { obj.feedback = value; } }, metadata: _metadata }, _feedback_initializers, _feedback_extraInitializers);
            __esDecorate(null, null, _comparisonToPrevious_decorators, { kind: "field", name: "comparisonToPrevious", static: false, private: false, access: { has: obj => "comparisonToPrevious" in obj, get: obj => obj.comparisonToPrevious, set: (obj, value) => { obj.comparisonToPrevious = value; } }, metadata: _metadata }, _comparisonToPrevious_initializers, _comparisonToPrevious_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MockExamRecord = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        examId = __runInitializers(this, _examId_initializers, void 0);
        userId = (__runInitializers(this, _examId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
        examDate = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _examDate_initializers, void 0));
        overallScore = (__runInitializers(this, _examDate_extraInitializers), __runInitializers(this, _overallScore_initializers, void 0));
        sectionScores = (__runInitializers(this, _overallScore_extraInitializers), __runInitializers(this, _sectionScores_initializers, void 0));
        sections = (__runInitializers(this, _sectionScores_extraInitializers), __runInitializers(this, _sections_initializers, void 0));
        ranking = (__runInitializers(this, _sections_extraInitializers), __runInitializers(this, _ranking_initializers, void 0));
        feedback = (__runInitializers(this, _ranking_extraInitializers), __runInitializers(this, _feedback_initializers, void 0));
        comparisonToPrevious = (__runInitializers(this, _feedback_extraInitializers), __runInitializers(this, _comparisonToPrevious_initializers, void 0));
        createdAt = (__runInitializers(this, _comparisonToPrevious_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    return MockExamRecord = _classThis;
})();
exports.MockExamRecord = MockExamRecord;
//# sourceMappingURL=MockExamRecord.js.map