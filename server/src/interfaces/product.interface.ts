import { Document, Types } from "mongoose";

export interface ImagesObject {
    id: string;
    file: string;
}

export interface Price {
    amount: number;
    currency: string;
}

export interface IProduct extends Document {
    _id: Types.ObjectId;
    unique_id: string;
    createdAt?: Date;
    updatedAt?: Date;
    name: string;
    description: string;
    category: string;
    make: string;
    productModel: string;
    price: Price[];
    negotiable: boolean;
    images?: ImagesObject[]
}
