import mongoose, { Schema, model, Types } from "mongoose";
import { IProduct, Price } from "../interfaces/product.interface";


const ImagesObjectSchema = new Schema<{
  id: string;
  file: string;
}>(
  {
    id: { type: String, required: true }, 
    file: { type: String, required: true }, 
  },
  { _id: false } 
);

const PriceSchema = new Schema<Price>(
  {
    amount: { type: Number, required: true }, 
    currency: { type: String, required: true }, 
  },
  { _id: false }
);


const ProductSchema = new Schema<IProduct>(
  {
    unique_id: { type: String, required: true, unique: true }, 
    name: { type: String, required: true }, 
    description: { type: String, required: true }, 
    category: { type: String, required: true }, 
    make: { type: String, required: true },
    productModel: { type: String, required: true }, 
    price: { type: [PriceSchema], required: true }, 
    negotiable: { type: Boolean, default: false }, 
    images: { type: [ImagesObjectSchema], default: [] }, 
  },
  { timestamps: true } 
);

export const Product = model<IProduct>("Product", ProductSchema);
