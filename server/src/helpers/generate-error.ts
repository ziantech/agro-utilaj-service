import { Response } from "express";
import { IErrorResponse } from "../interfaces/shared.interface";

export const generateErrorResponse = (
    res: Response,
    status: number,
    message: string,
    field?: string
): void => {
    const errorResponse: IErrorResponse = { message };

    if(field) {
        errorResponse.field = field;
    }

    res.status(status).json(errorResponse)
}