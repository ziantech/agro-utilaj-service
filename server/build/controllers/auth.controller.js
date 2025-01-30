"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.signup = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var user_model_1 = __importDefault(require("../models/user.model"));
var generate_error_1 = require("../helpers/generate-error");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var crypto_1 = __importDefault(require("crypto"));
var email_service_1 = require("../services/email.service");
var generate_email_1 = require("../helpers/generate-email");
var signup = function () { return __awaiter(void 0, void 0, void 0, function () {
    var email, password, hashedPassword, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = "";
                password = "mamaligaP123!";
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 12)];
            case 1:
                hashedPassword = _a.sent();
                user = new user_model_1.default({
                    email: email,
                    password: hashedPassword
                });
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                console.log("user created");
                return [2 /*return*/];
        }
    });
}); };
exports.signup = signup;
var login = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPasswordValid, token, response, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!user) {
                    (0, generate_error_1.generateErrorResponse)(res, 404, "E-mail sau parola gresita!");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 2:
                isPasswordValid = _b.sent();
                if (!isPasswordValid) {
                    (0, generate_error_1.generateErrorResponse)(res, 404, "E-mail sau parola gresita!");
                    return [2 /*return*/];
                }
                user.refreshToken = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10y' });
                return [4 /*yield*/, user.save()];
            case 3:
                _b.sent();
                token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, }, process.env.JWT_SECRET, { expiresIn: '3y' });
                response = {
                    message: "Autentificare reusita!",
                    token: token,
                    refreshToken: user.refreshToken,
                    id: user._id.toString()
                };
                res.status(200).json(response);
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var forgotPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, resetToken, resetLink, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                email = req.body.email;
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!user) {
                    (0, generate_error_1.generateErrorResponse)(res, 404, "Am primit cererea dvs, daca un account este asociat cu emailul introdus, o sa primiti pe email un link de resetare.");
                    return [2 /*return*/];
                }
                resetToken = crypto_1.default.randomBytes(20).toString('hex');
                user.passwordResetToken = resetToken;
                user.passwordResetTokenExpires = new Date(Date.now() + 3600000);
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                resetLink = "".concat(process.env.FRONTEND_URL, "/reset-password?token=").concat(resetToken);
                return [4 /*yield*/, (0, email_service_1.sendEmail)(email, "Ai uitat parola?", (0, generate_email_1.generateEmail)(email, 'forgotPassword', { confirmationLink: resetLink }))];
            case 3:
                _a.sent();
                res.status(200).json({ message: 'Am primit cererea dvs, daca un account este asociat cu emailul introdus, o sa primiti pe email un link de resetare.' });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.forgotPassword = forgotPassword;
var resetPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, password, token, user, hashedPassword, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, password = _a.password, token = _a.token;
                return [4 /*yield*/, user_model_1.default.findOne({
                        passwordResetToken: token,
                        passwordResetTokenExpires: { $gt: Date.now() },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    (0, generate_error_1.generateErrorResponse)(res, 404, "Cod de resetare invalid sau expirat.", "password");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                user.password = hashedPassword;
                user.passwordResetToken = '';
                user.passwordResetTokenExpires = new Date();
                return [4 /*yield*/, user.save()];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, email_service_1.sendEmail)(user.email, 'Parola Schimbata', (0, generate_email_1.generateEmail)(user.email, 'passwordChanged', {}))];
            case 4:
                _b.sent();
                res.status(200).json({ message: 'Parola a fost schimbata cu success.' });
                return [3 /*break*/, 6];
            case 5:
                error_3 = _b.sent();
                next(error_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
