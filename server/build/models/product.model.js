"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
var mongoose_1 = require("mongoose");
var ImagesObjectSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    file: { type: String, required: true },
}, { _id: false });
var PriceSchema = new mongoose_1.Schema({
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
}, { _id: false });
var ProductSchema = new mongoose_1.Schema({
    unique_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    make: { type: String, required: true },
    productModel: { type: String, required: true },
    price: { type: [PriceSchema], required: true },
    negotiable: { type: Boolean, default: false },
    images: { type: [ImagesObjectSchema], default: [] },
}, { timestamps: true });
exports.Product = (0, mongoose_1.model)("Product", ProductSchema);
