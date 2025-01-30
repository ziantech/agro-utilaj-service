import { NextFunction, Request, Response } from "express";
import { IForgotPasswordBody, ILoginRequestBody } from "../interfaces/user.interface";
import { isValidEmail, isValidPassword } from "../helpers/data-type-checks/data-type-checks";
import { generateErrorResponse } from "../helpers/generate-error";

export const validateLogin = (req: Request, res: Response, next: NextFunction):void => {
    const {email, password}: ILoginRequestBody = req.body;

    if(!isValidEmail(email)) {
        generateErrorResponse(res, 400,  'E-mail invalid.','email')
        return;
    }
    next()
}

export const validateForgotPassword = (req: Request, res: Response, next: NextFunction):void => {
    const {email}: IForgotPasswordBody = req.body;

    if(!isValidEmail(email)) {
        generateErrorResponse(res, 400,  'E-mail invalid.','email')
        return;
    }
    next()
}

