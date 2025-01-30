"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateForgotPassword = exports.validateLogin = void 0;
var data_type_checks_1 = require("../helpers/data-type-checks/data-type-checks");
var generate_error_1 = require("../helpers/generate-error");
var validateLogin = function (req, res, next) {
    var _a = req.body, email = _a.email, password = _a.password;
    if (!(0, data_type_checks_1.isValidEmail)(email)) {
        (0, generate_error_1.generateErrorResponse)(res, 400, 'E-mail invalid.', 'email');
        return;
    }
    next();
};
exports.validateLogin = validateLogin;
var validateForgotPassword = function (req, res, next) {
    var email = req.body.email;
    if (!(0, data_type_checks_1.isValidEmail)(email)) {
        (0, generate_error_1.generateErrorResponse)(res, 400, 'E-mail invalid.', 'email');
        return;
    }
    next();
};
exports.validateForgotPassword = validateForgotPassword;
