"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateErrorResponse = void 0;
var generateErrorResponse = function (res, status, message, field) {
    var errorResponse = { message: message };
    if (field) {
        errorResponse.field = field;
    }
    res.status(status).json(errorResponse);
};
exports.generateErrorResponse = generateErrorResponse;
