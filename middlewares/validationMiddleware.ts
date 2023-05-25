import {NextFunction, Request, Response} from "express";
import {validationResult} from 'express-validator';
import { APP_CONSTANTS } from "../constants";

export const validationMiddleware = (request:Request, response:Response, next:NextFunction) => {
    // validate the form
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(401).json({
            msg: errors.array().map(error => error.msg).join('\n'),
            data: null,
            status:APP_CONSTANTS.FAILED
        })
    }
    next();
}