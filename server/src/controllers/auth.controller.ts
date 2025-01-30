import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs'
import User from '../models/user.model';
import { IAuthResponse, IForgotPasswordBody, ILoginRequestBody, IUser } from '../interfaces/user.interface';
import { generateErrorResponse } from '../helpers/generate-error';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../services/email.service';
import { generateEmail } from '../helpers/generate-email';

export const signup = async () => {
    const email = ""
    const password = "mamaligaP123!"

    const hashedPassword = await bcrypt.hash(password, 12);

    const user:IUser = new User({
        email,
        password: hashedPassword
    })

    await user.save()
    console.log("user created");
}


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password}:ILoginRequestBody = req.body;

        const user = await User.findOne({email: email});

        if(!user) {
            generateErrorResponse(res, 404, "E-mail sau parola gresita!")
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password!)

        if(!isPasswordValid) {
            generateErrorResponse(res, 404, "E-mail sau parola gresita!")
            return;
        }

        user.refreshToken = jwt.sign({id: user._id, email: user.email,}, process.env.REFRESH_TOKEN_SECRET!, {expiresIn:'10y'});

        await user.save();

        const token = jwt.sign({id: user._id, email: user.email, }, process.env.JWT_SECRET!, {expiresIn:'3y'});

        const response: IAuthResponse = {
            message: "Autentificare reusita!",
            token,
            refreshToken: user.refreshToken,
            id: user._id.toString()
        }

        res.status(200).json(response)

    } catch (error) {
        next(error)
    }
 };
 
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email }: IForgotPasswordBody = req.body;

        const user = await User.findOne({email: email});

        if(!user) {
            generateErrorResponse(res, 404, "Am primit cererea dvs, daca un account este asociat cu emailul introdus, o sa primiti pe email un link de resetare.")
            return;
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.passwordResetToken = resetToken;
        user.passwordResetTokenExpires = new Date(Date.now() + 3600000);
        await user.save();
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        await sendEmail(email, "Ai uitat parola?", generateEmail(email, 'forgotPassword', {confirmationLink: resetLink}));

        res.status(200).json({message:'Am primit cererea dvs, daca un account este asociat cu emailul introdus, o sa primiti pe email un link de resetare.'})

    } catch (error) {
        next(error)
    }
 }

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, token } = req.body;

        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            generateErrorResponse(res, 404, "Cod de resetare invalid sau expirat.", "password")
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.passwordResetToken = '';
        user.passwordResetTokenExpires = new Date();

        await user.save();

        await sendEmail(user.email!, 'Parola Schimbata', generateEmail(user.email!, 'passwordChanged', {}));

        res.status(200).json({ message: 'Parola a fost schimbata cu success.' });
    } catch (error) {
        next(error)
    }
}