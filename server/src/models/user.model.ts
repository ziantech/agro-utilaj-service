import mongoose, {Schema} from "mongoose";
import { IUser } from "../interfaces/user.interface";

const UserSchema: Schema = new Schema<IUser>({
    email : {type: String, required: true},
    password : {type: String, required: true},
    passwordResetToken: {type: String, default:'' },
    passwordResetTokenExpires: {type: Date, default: new Date()},
    refreshToken: {type: String, default:''},
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);