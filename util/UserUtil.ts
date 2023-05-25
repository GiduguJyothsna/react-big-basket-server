import {Request, Response} from 'express';
import mongoose from 'mongoose';
import UserTable from '../schemas/userSchema';
import { ThrowError } from './ErrorUtil';

export const getUser = async (reruest:Request, response: Response) => {
    try{
        let theUser: any = reruest.headers["user"];
        let userId = theUser.id;
        if(!userId){
            return response.status(401).json({
                msg: "Invalid User Request"
            });
        }
        const mongoUserId = new mongoose.Types.ObjectId(userId);
        let userObj: any = await UserTable.findById(mongoUserId);
        if(!userObj){
            return ThrowError(response, 404,  "User is not found")
        }
        return userObj;
    }catch(error){
        return ThrowError(response);
    }
}