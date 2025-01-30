"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPassword = exports.isValidEmail = void 0;
var isValidEmail = function (value) {
    if (typeof value !== 'string') {
        return false;
    }
    if (value.trim() === '') {
        return false;
    }
    var sqlInjectionPattern = /('|--|;|\/\*|\*\/|xp_)/i;
    if (sqlInjectionPattern.test(value)) {
        return false;
    }
    var xssPattern = /<script|<\/script>|<[^>]+>/i;
    if (xssPattern.test(value)) {
        return false;
    }
    if (decodeURIComponent(value) !== value) {
        return false;
    }
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(value);
};
exports.isValidEmail = isValidEmail;
var isValidPassword = function (value) {
    if (typeof value !== 'string' || value.trim() === '') {
        return false;
    }
    if (value.length < 6) {
        return false;
    }
    var hasNumber = /\d/;
    if (!hasNumber.test(value)) {
        return false;
    }
    return true;
};
exports.isValidPassword = isValidPassword;
