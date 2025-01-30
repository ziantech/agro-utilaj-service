import { Document, Types } from "mongoose";


export interface IUser extends Document {
    _id: Types.ObjectId;
    email?:string;
    password?: string;
    passwordResetToken?: string;
    passwordResetTokenExpires?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    refreshToken: string;
}

export interface ILoginRequestBody {
    email: string;
    password: string;
}

export interface IAuthResponse {
    message: string;
    token: string;
    refreshToken: string;
    id:string;
}

export interface IForgotPasswordBody {
    email: string;
}