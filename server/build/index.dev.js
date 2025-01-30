"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var app_dev_1 = __importDefault(require("./app.dev"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var PORT = process.env.PORT || 5000;
var server = (0, http_1.createServer)(app_dev_1.default);
server.listen(PORT, function () {
    console.log("Development server running on http://localhost:".concat(PORT));
});
