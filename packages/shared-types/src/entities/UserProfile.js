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
exports.UserProfile = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let UserProfile = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _user_decorators;
    let _user_initializers = [];
    let _user_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _grade_decorators;
    let _grade_initializers = [];
    let _grade_extraInitializers = [];
    let _school_decorators;
    let _school_initializers = [];
    let _school_extraInitializers = [];
    let _targetExamDate_decorators;
    let _targetExamDate_initializers = [];
    let _targetExamDate_extraInitializers = [];
    let _baselineLevel_decorators;
    let _baselineLevel_initializers = [];
    let _baselineLevel_extraInitializers = [];
    let _currentLevel_decorators;
    let _currentLevel_initializers = [];
    let _currentLevel_extraInitializers = [];
    let _learningPath_decorators;
    let _learningPath_initializers = [];
    let _learningPath_extraInitializers = [];
    var UserProfile = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
            _user_decorators = [(0, typeorm_1.OneToOne)(() => User_1.User, (user) => user.profile), (0, typeorm_1.JoinColumn)()];
            _name_decorators = [(0, typeorm_1.Column)()];
            _grade_decorators = [(0, typeorm_1.Column)()];
            _school_decorators = [(0, typeorm_1.Column)({ nullable: true })];
            _targetExamDate_decorators = [(0, typeorm_1.Column)({ nullable: true })];
            _baselineLevel_decorators = [(0, typeorm_1.Column)("jsonb", { nullable: true })];
            _currentLevel_decorators = [(0, typeorm_1.Column)("jsonb", { nullable: true })];
            _learningPath_decorators = [(0, typeorm_1.Column)("jsonb", { nullable: true })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: obj => "user" in obj, get: obj => obj.user, set: (obj, value) => { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _grade_decorators, { kind: "field", name: "grade", static: false, private: false, access: { has: obj => "grade" in obj, get: obj => obj.grade, set: (obj, value) => { obj.grade = value; } }, metadata: _metadata }, _grade_initializers, _grade_extraInitializers);
            __esDecorate(null, null, _school_decorators, { kind: "field", name: "school", static: false, private: false, access: { has: obj => "school" in obj, get: obj => obj.school, set: (obj, value) => { obj.school = value; } }, metadata: _metadata }, _school_initializers, _school_extraInitializers);
            __esDecorate(null, null, _targetExamDate_decorators, { kind: "field", name: "targetExamDate", static: false, private: false, access: { has: obj => "targetExamDate" in obj, get: obj => obj.targetExamDate, set: (obj, value) => { obj.targetExamDate = value; } }, metadata: _metadata }, _targetExamDate_initializers, _targetExamDate_extraInitializers);
            __esDecorate(null, null, _baselineLevel_decorators, { kind: "field", name: "baselineLevel", static: false, private: false, access: { has: obj => "baselineLevel" in obj, get: obj => obj.baselineLevel, set: (obj, value) => { obj.baselineLevel = value; } }, metadata: _metadata }, _baselineLevel_initializers, _baselineLevel_extraInitializers);
            __esDecorate(null, null, _currentLevel_decorators, { kind: "field", name: "currentLevel", static: false, private: false, access: { has: obj => "currentLevel" in obj, get: obj => obj.currentLevel, set: (obj, value) => { obj.currentLevel = value; } }, metadata: _metadata }, _currentLevel_initializers, _currentLevel_extraInitializers);
            __esDecorate(null, null, _learningPath_decorators, { kind: "field", name: "learningPath", static: false, private: false, access: { has: obj => "learningPath" in obj, get: obj => obj.learningPath, set: (obj, value) => { obj.learningPath = value; } }, metadata: _metadata }, _learningPath_initializers, _learningPath_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UserProfile = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        user = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _user_initializers, void 0));
        name = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _name_initializers, void 0));
        grade = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _grade_initializers, void 0));
        school = (__runInitializers(this, _grade_extraInitializers), __runInitializers(this, _school_initializers, void 0));
        targetExamDate = (__runInitializers(this, _school_extraInitializers), __runInitializers(this, _targetExamDate_initializers, void 0));
        baselineLevel = (__runInitializers(this, _targetExamDate_extraInitializers), __runInitializers(this, _baselineLevel_initializers, void 0));
        currentLevel = (__runInitializers(this, _baselineLevel_extraInitializers), __runInitializers(this, _currentLevel_initializers, void 0));
        learningPath = (__runInitializers(this, _currentLevel_extraInitializers), __runInitializers(this, _learningPath_initializers, void 0));
        constructor() {
            __runInitializers(this, _learningPath_extraInitializers);
        }
    };
    return UserProfile = _classThis;
})();
exports.UserProfile = UserProfile;
//# sourceMappingURL=UserProfile.js.map