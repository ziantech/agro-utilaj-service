"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
var multer_1 = __importDefault(require("multer"));
var storage = multer_1.default.memoryStorage();
var allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
var fileFilter = function (req, file, cb) {
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Only JPEG and PNG formats are allowed'));
    }
    cb(null, true);
};
var upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 10,
    },
}).array('images', 10);
var uploadMiddleware = function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'At least one image is required' });
        }
        req.body.images = req.files;
        next();
    });
};
exports.uploadMiddleware = uploadMiddleware;
