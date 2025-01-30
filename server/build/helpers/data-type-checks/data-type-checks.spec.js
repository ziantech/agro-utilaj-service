"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_type_checks_1 = require("./data-type-checks");
describe('isValidEmail', function () {
    it('should return true for valid email addresses', function () {
        expect((0, data_type_checks_1.isValidEmail)('test@example.com')).toBe(true);
        expect((0, data_type_checks_1.isValidEmail)('test+alias@example.com')).toBe(true);
        expect((0, data_type_checks_1.isValidEmail)('user.name@domain.co')).toBe(true);
    });
    it('should return false for invalid email formats', function () {
        expect((0, data_type_checks_1.isValidEmail)('test@')).toBe(false);
        expect((0, data_type_checks_1.isValidEmail)('@example.com')).toBe(false);
        expect((0, data_type_checks_1.isValidEmail)('test@com')).toBe(false);
        expect((0, data_type_checks_1.isValidEmail)('plainaddress')).toBe(false);
    });
    it('should return false for inputs with SQL injection patterns', function () {
        expect((0, data_type_checks_1.isValidEmail)("test'; DROP TABLE users; --@example.com")).toBe(false);
        expect((0, data_type_checks_1.isValidEmail)("test@example.com' OR 1=1; --")).toBe(false);
    });
    it('should return false for inputs with XSS attempts', function () {
        expect((0, data_type_checks_1.isValidEmail)('<script>alert(1)</script>@example.com')).toBe(false);
        expect((0, data_type_checks_1.isValidEmail)('<img src=x onerror=alert(1)>@example.com')).toBe(false);
    });
    it('should return false for empty or whitespace-only strings', function () {
        expect((0, data_type_checks_1.isValidEmail)('')).toBe(false);
        expect((0, data_type_checks_1.isValidEmail)('   ')).toBe(false);
    });
    it('should return false for non-string inputs', function () {
        expect((0, data_type_checks_1.isValidEmail)(null)).toBe(false);
        expect((0, data_type_checks_1.isValidEmail)(undefined)).toBe(false);
        expect((0, data_type_checks_1.isValidEmail)(12345)).toBe(false);
        expect((0, data_type_checks_1.isValidEmail)({})).toBe(false);
    });
    it('should return false for encoded values', function () {
        expect((0, data_type_checks_1.isValidEmail)('%27test@example.com')).toBe(false); // Encoded single quote
        expect((0, data_type_checks_1.isValidEmail)('%3Cscript%3Ealert%281%29%3C%2Fscript%3E@example.com')).toBe(false); // Encoded XSS
    });
});
describe('isValidPassword', function () {
    it('should return true for valid passwords', function () {
        expect((0, data_type_checks_1.isValidPassword)('abc123')).toBe(true);
        expect((0, data_type_checks_1.isValidPassword)('Passw0rd!')).toBe(true);
        expect((0, data_type_checks_1.isValidPassword)('123abc')).toBe(true);
    });
    it('should return false for passwords shorter than 6 characters', function () {
        expect((0, data_type_checks_1.isValidPassword)('123')).toBe(false);
        expect((0, data_type_checks_1.isValidPassword)('abc')).toBe(false);
        expect((0, data_type_checks_1.isValidPassword)('ab1')).toBe(false);
    });
    it('should return false for passwords without numbers', function () {
        expect((0, data_type_checks_1.isValidPassword)('abcdef')).toBe(false);
        expect((0, data_type_checks_1.isValidPassword)('Password')).toBe(false);
    });
    it('should return true for passwords with special characters and numbers', function () {
        expect((0, data_type_checks_1.isValidPassword)('abc!@#123')).toBe(true);
        expect((0, data_type_checks_1.isValidPassword)('!pass1')).toBe(true);
    });
    it('should return false for non-string inputs', function () {
        expect((0, data_type_checks_1.isValidPassword)(null)).toBe(false);
        expect((0, data_type_checks_1.isValidPassword)(undefined)).toBe(false);
        expect((0, data_type_checks_1.isValidPassword)(123456)).toBe(false);
        expect((0, data_type_checks_1.isValidPassword)({})).toBe(false);
    });
    it('should return false for empty or whitespace-only passwords', function () {
        expect((0, data_type_checks_1.isValidPassword)('')).toBe(false);
        expect((0, data_type_checks_1.isValidPassword)('     ')).toBe(false);
    });
});
