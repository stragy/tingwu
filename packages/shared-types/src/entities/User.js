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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const UserProfile_1 = require("./UserProfile");
const AuthToken_1 = require("./AuthToken");
let User = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _username_decorators;
    let _username_initializers = [];
    let _username_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _passwordHash_decorators;
    let _passwordHash_initializers = [];
    let _passwordHash_extraInitializers = [];
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
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _profile_decorators;
    let _profile_initializers = [];
    let _profile_extraInitializers = [];
    let _tokens_decorators;
    let _tokens_initializers = [];
    let _tokens_extraInitializers = [];
    var User = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
            _username_decorators = [(0, typeorm_1.Column)({ unique: true })];
            _email_decorators = [(0, typeorm_1.Column)({ unique: true })];
            _passwordHash_decorators = [(0, typeorm_1.Column)()];
            _name_decorators = [(0, typeorm_1.Column)()];
            _grade_decorators = [(0, typeorm_1.Column)()];
            _school_decorators = [(0, typeorm_1.Column)({ nullable: true })];
            _targetExamDate_decorators = [(0, typeorm_1.Column)({ nullable: true })];
            _baselineLevel_decorators = [(0, typeorm_1.Column)('jsonb', { nullable: true })];
            _currentLevel_decorators = [(0, typeorm_1.Column)('jsonb', { nullable: true })];
            _learningPath_decorators = [(0, typeorm_1.Column)('jsonb', { nullable: true })];
            _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
            _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
            _profile_decorators = [(0, typeorm_1.OneToOne)(() => UserProfile_1.UserProfile, (profile) => profile.user), (0, typeorm_1.JoinColumn)()];
            _tokens_decorators = [(0, typeorm_1.OneToMany)(() => AuthToken_1.AuthToken, (token) => token.user)];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _username_decorators, { kind: "field", name: "username", static: false, private: false, access: { has: obj => "username" in obj, get: obj => obj.username, set: (obj, value) => { obj.username = value; } }, metadata: _metadata }, _username_initializers, _username_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _passwordHash_decorators, { kind: "field", name: "passwordHash", static: false, private: false, access: { has: obj => "passwordHash" in obj, get: obj => obj.passwordHash, set: (obj, value) => { obj.passwordHash = value; } }, metadata: _metadata }, _passwordHash_initializers, _passwordHash_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _grade_decorators, { kind: "field", name: "grade", static: false, private: false, access: { has: obj => "grade" in obj, get: obj => obj.grade, set: (obj, value) => { obj.grade = value; } }, metadata: _metadata }, _grade_initializers, _grade_extraInitializers);
            __esDecorate(null, null, _school_decorators, { kind: "field", name: "school", static: false, private: false, access: { has: obj => "school" in obj, get: obj => obj.school, set: (obj, value) => { obj.school = value; } }, metadata: _metadata }, _school_initializers, _school_extraInitializers);
            __esDecorate(null, null, _targetExamDate_decorators, { kind: "field", name: "targetExamDate", static: false, private: false, access: { has: obj => "targetExamDate" in obj, get: obj => obj.targetExamDate, set: (obj, value) => { obj.targetExamDate = value; } }, metadata: _metadata }, _targetExamDate_initializers, _targetExamDate_extraInitializers);
            __esDecorate(null, null, _baselineLevel_decorators, { kind: "field", name: "baselineLevel", static: false, private: false, access: { has: obj => "baselineLevel" in obj, get: obj => obj.baselineLevel, set: (obj, value) => { obj.baselineLevel = value; } }, metadata: _metadata }, _baselineLevel_initializers, _baselineLevel_extraInitializers);
            __esDecorate(null, null, _currentLevel_decorators, { kind: "field", name: "currentLevel", static: false, private: false, access: { has: obj => "currentLevel" in obj, get: obj => obj.currentLevel, set: (obj, value) => { obj.currentLevel = value; } }, metadata: _metadata }, _currentLevel_initializers, _currentLevel_extraInitializers);
            __esDecorate(null, null, _learningPath_decorators, { kind: "field", name: "learningPath", static: false, private: false, access: { has: obj => "learningPath" in obj, get: obj => obj.learningPath, set: (obj, value) => { obj.learningPath = value; } }, metadata: _metadata }, _learningPath_initializers, _learningPath_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _profile_decorators, { kind: "field", name: "profile", static: false, private: false, access: { has: obj => "profile" in obj, get: obj => obj.profile, set: (obj, value) => { obj.profile = value; } }, metadata: _metadata }, _profile_initializers, _profile_extraInitializers);
            __esDecorate(null, null, _tokens_decorators, { kind: "field", name: "tokens", static: false, private: false, access: { has: obj => "tokens" in obj, get: obj => obj.tokens, set: (obj, value) => { obj.tokens = value; } }, metadata: _metadata }, _tokens_initializers, _tokens_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            User = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        username = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _username_initializers, void 0));
        email = (__runInitializers(this, _username_extraInitializers), __runInitializers(this, _email_initializers, void 0));
        passwordHash = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _passwordHash_initializers, void 0));
        name = (__runInitializers(this, _passwordHash_extraInitializers), __runInitializers(this, _name_initializers, void 0));
        grade = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _grade_initializers, void 0));
        school = (__runInitializers(this, _grade_extraInitializers), __runInitializers(this, _school_initializers, void 0));
        targetExamDate = (__runInitializers(this, _school_extraInitializers), __runInitializers(this, _targetExamDate_initializers, void 0));
        baselineLevel = (__runInitializers(this, _targetExamDate_extraInitializers), __runInitializers(this, _baselineLevel_initializers, void 0));
        currentLevel = (__runInitializers(this, _baselineLevel_extraInitializers), __runInitializers(this, _currentLevel_initializers, void 0));
        learningPath = (__runInitializers(this, _currentLevel_extraInitializers), __runInitializers(this, _learningPath_initializers, void 0));
        createdAt = (__runInitializers(this, _learningPath_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        profile = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _profile_initializers, void 0));
        tokens = (__runInitializers(this, _profile_extraInitializers), __runInitializers(this, _tokens_initializers, void 0));
        constructor() {
            __runInitializers(this, _tokens_extraInitializers);
        }
    };
    return User = _classThis;
})();
exports.User = User;
//# sourceMappingURL=User.js.map