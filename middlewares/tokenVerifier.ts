import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";  

export const tokenVerifier = async (request:Request, response:Response, next:NextFunction) => {
    try{
        // read the request from token
        let secretKey: string | undefined = process.env.EXPRESS_APP_JWT_SECRET_KEY;
        if(secretKey){
            let token = request.headers["x-auth-token"];
            if (!token) {
                return response.status(401).json({
                    msg: "NO Token Provided!"
                });
            }
        if(typeof token === "string" && secretKey){
            let decodeObj: any = await jwt.verify(token,secretKey);
            request.headers["user"] = decodeObj;
            next(); // passing to actual URL
            }else{
                return response.status(401).json({
                    msg: "An Invalid Token!"
                });
            }
        }
    } catch (error) {
        return response.status(500).json({msg: "Token verification is failed!"});
    }
};