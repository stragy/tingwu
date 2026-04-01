"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseContentEntity = exports.MockExamRecord = exports.ErrorPattern = exports.LearningPath = exports.EvaluationRecord = exports.PracticeSession = exports.UserProfile = exports.AuthToken = exports.User = exports.ErrorType = exports.SessionStatus = exports.ExerciseType = exports.initTracing = exports.createLogger = exports.logger = void 0;
var logger_1 = require("./logger");
Object.defineProperty(exports, "logger", { enumerable: true, get: function () { return logger_1.logger; } });
Object.defineProperty(exports, "createLogger", { enumerable: true, get: function () { return logger_1.createLogger; } });
var tracing_1 = require("./tracing");
Object.defineProperty(exports, "initTracing", { enumerable: true, get: function () { return tracing_1.initTracing; } });
// Exercise Types
var ExerciseType;
(function (ExerciseType) {
    ExerciseType["READING_ALOUD"] = "reading_aloud";
    ExerciseType["SITUATIONAL_QA"] = "situational_qa";
    ExerciseType["INFORMATION_RETELLING"] = "information_retelling";
    ExerciseType["ROLE_PLAY"] = "role_play";
})(ExerciseType || (exports.ExerciseType = ExerciseType = {}));
// Session Types
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["PENDING"] = "pending";
    SessionStatus["IN_PROGRESS"] = "in_progress";
    SessionStatus["COMPLETED"] = "completed";
    SessionStatus["FAILED"] = "failed";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
var ErrorType;
(function (ErrorType) {
    ErrorType["PRONUNCIATION"] = "pronunciation";
    ErrorType["GRAMMAR"] = "grammar";
    ErrorType["VOCABULARY"] = "vocabulary";
    ErrorType["FLUENCY"] = "fluency";
    ErrorType["CONTENT"] = "content";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
// Re-export TypeORM entities so backend services can import them from `@tingwu/shared-types`.
var User_1 = require("./entities/User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
var AuthToken_1 = require("./entities/AuthToken");
Object.defineProperty(exports, "AuthToken", { enumerable: true, get: function () { return AuthToken_1.AuthToken; } });
var UserProfile_1 = require("./entities/UserProfile");
Object.defineProperty(exports, "UserProfile", { enumerable: true, get: function () { return UserProfile_1.UserProfile; } });
var PracticeSession_1 = require("./entities/PracticeSession");
Object.defineProperty(exports, "PracticeSession", { enumerable: true, get: function () { return PracticeSession_1.PracticeSession; } });
var EvaluationRecord_1 = require("./entities/EvaluationRecord");
Object.defineProperty(exports, "EvaluationRecord", { enumerable: true, get: function () { return EvaluationRecord_1.EvaluationRecord; } });
var LearningPath_1 = require("./entities/LearningPath");
Object.defineProperty(exports, "LearningPath", { enumerable: true, get: function () { return LearningPath_1.LearningPath; } });
var ErrorPattern_1 = require("./entities/ErrorPattern");
Object.defineProperty(exports, "ErrorPattern", { enumerable: true, get: function () { return ErrorPattern_1.ErrorPattern; } });
var MockExamRecord_1 = require("./entities/MockExamRecord");
Object.defineProperty(exports, "MockExamRecord", { enumerable: true, get: function () { return MockExamRecord_1.MockExamRecord; } });
var ExerciseContent_1 = require("./entities/ExerciseContent");
Object.defineProperty(exports, "ExerciseContentEntity", { enumerable: true, get: function () { return ExerciseContent_1.ExerciseContentEntity; } });
//# sourceMappingURL=index.js.map