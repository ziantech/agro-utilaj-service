"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var validate_env_1 = require("./helpers/validate-env");
var db_1 = require("./config/db");
var helmet_1 = __importDefault(require("helmet"));
var auth_routes_1 = __importDefault(require("./routes/auth.routes"));
dotenv_1.default.config();
try {
    (0, validate_env_1.validateEnv)();
}
catch (error) {
    console.error(error.message);
    process.exit(1);
}
console.log('Developmental Environment');
var app = (0, express_1.default)();
(0, db_1.connectDbDev)();
app.use((0, helmet_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
app.use((0, cors_1.default)({
    origin: [process.env.CORS_ORIGIN],
    methods: ((_a = process.env.CORS_METHODS) === null || _a === void 0 ? void 0 : _a.split(',')) || ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use((0, morgan_1.default)('dev'));
//Routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/product');
app.use('/test', function (req, res) {
    res.send('Backend Working in Development Mode');
});
exports.default = app;
