import {Request, Response} from 'express';
import { ThrowError } from '../util/ErrorUtil';
import UserTable from '../schemas/userSchema';
import bcryptjs from 'bcryptjs';
import gravatar from 'gravatar';
import { IUser } from '../models/IUser';
import jwt from 'jsonwebtoken';
import { APP_CONSTANTS } from '../constants';
import * as UserUtil from '../util/UserUtil';
import mongoose from 'mongoose';

/**
 * @usage : Register a User
 * @url : http://localhost:9000/api/users/register
 * @body : username , email , password
 * @method : POST
 * @access : PUBLIC
 */
export const registerUser = async (request:Request, response:Response) => {
        try{
           // read the form data
        const {username, email, password} = request.body;

        // check if the email is exists?
        const userObj = await UserTable.findOne({email: email});
        if (userObj) {
            return response.status(401).json({
                msg: "User is already exists!",
                data: null,
                status: APP_CONSTANTS. FAILED
            })
        }

        // encrypt the password
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        // gravatar image url
        let imageUrl: string = gravatar.url(email, {
            size: '200',
            rating: 'pg',
            default: 'mm'
        });

        // create user object
        const newUser: IUser = {
            username: username,
            email: email,
            password: hashPassword,
            imageUrl: imageUrl
        };
        
        // save to DB
        const createdUser = await new UserTable(newUser).save(); // INSERT
        if (createdUser) {
            return response.status(200).json({
                msg: "Registration is Success",
                user: createdUser
            });
        } 
        }catch(error){
            return ThrowError(response)
        }
};

/**
 * @usage : Login a User
 * @url : http://localhost:9000/api/users/login
 * @body : email , password
 * @method : POST
 * @access : PUBLIC
 */
export const loginUser = async (request:Request, response:Response) => {
    try{
        // read the form data
        const {email, password} = request.body;

        // check if the email is exists?
        const userObj = await UserTable.findOne({email: email});
        if (!userObj) {
            return response.status(401).json({
                msg: "Invalid Credentials Email",
                data: null,
                status: APP_CONSTANTS.FAILED
            });
        }

        // check the password
        const isMatch: boolean = await bcryptjs.compare(password, userObj.password);
        if (!isMatch) {
            return response.status(401).json({
                msg: "Invalid Credentials Password!",
                data: null,
                status: APP_CONSTANTS.FAILED
            })
        }
        // Create token
        const payload = {
            id: userObj._id,
            email: userObj.email
        };
        const secretKey: string | undefined = process.env.EXPRESS_APP_JWT_SECRET_KEY;
        if (payload && secretKey) {
            const token = jwt.sign(payload, secretKey, {
                algorithm: "HS256",
                expiresIn: 100000000000000
            }); 
            return response.status(200).json({
                msg: "Login is Success",
                token: token,
                data: userObj,
                status: APP_CONSTANTS.SUCCESS
            });
        } 
    }catch(error){
        return ThrowError(response)
    }
};

 /**
 *  @usage : get users Data
 *  @url : http://localhost:9000/api/users/me
 *  @method : GET
 *  @param : request
 *  @param : response
 *  @access : PRIVATE
 */
 export const getUsersData = async (request:Request, response:Response) => {
    try{
        // check if the user exists
        const theUser = await UserUtil.getUser(request, response);
        if(theUser){
            response.status(200).json({
                data: theUser,
                status: APP_CONSTANTS.SUCCESS,
                msg: ""
            });
        }
    }catch(error){
        return ThrowError(response)
    }
};

/**
 * @usage : update profile Picture
 * @url : http://localhost:9000/api/users/profile
 * @body : imageUrl
 * @method : POST
 * @access : PRIVATE
 */
export const updateProfilePicture = async (request:Request, response:Response) => {
    try{
        const {imageUrl} = request.body;
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            theUser.imageUrl = imageUrl;
            const userObj = await theUser.save();
            if(userObj){
                response.status(200).json({
                    status: APP_CONSTANTS.SUCCESS,
                    msg: "Profile picture is updated",
                    data: userObj
                });
            }
        }
    }catch(error){
        return ThrowError(response)
    }
};

 /**
 * @usage : change the password
 * @url : http://localhost:9000/api/users/change-password
 * @body : password
 * @method : POST
 * @access : PRIVATE
 */
 export const changePassword = async (request:Request, response:Response) => {
    try{
        const {password} = request.body;
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password,salt);
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            theUser.password = hashPassword;
            const userObj = await theUser.save();
            if(userObj){
                return response.status(200).json({
                    status: APP_CONSTANTS.SUCCESS,
                    msg: "Password is changed",
                    data: userObj
                })
            }
        }
    }catch(error){
        return ThrowError(response)
    }
};
