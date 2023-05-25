import {Request, Response} from 'express';
import { ThrowError } from '../util/ErrorUtil';
import * as UserUtil from "../util/UserUtil";
import CartTable from '../schemas/cartSchema';
import { ICart } from '../models/ICart';
import mongoose from 'mongoose';
import { APP_CONSTANTS } from '../constants';

/**
 * @usage : create a Cart
 * @url : http://localhost:9000/api/carts/
 * @body :products[{product, count,price}],total,tax,grandTotal
 * @method : POST
 * @access : PRIVATE
 */
export const createCart = async (request:Request, response:Response) => {
    try{
        const {products,total,tax,grandTotal} = request.body;
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            // check if user already have a cart
            const cart = await CartTable.findOne({userObj: theUser._id});
            if(cart){
                await CartTable.findOneAndDelete({userObj: theUser._id});
            }
            const newCart: ICart = {
                products: products,
                total: total,
                tax: tax,
                grandTotal: grandTotal,
                userObj: theUser._id
            };
            const theCart = await new CartTable(newCart).save();
            if(!theCart){
                return response.status(400).json({msg: "Cart creation is Failed"});
            }
            const actualCart = await CartTable.findById(new mongoose.Types.ObjectId(theCart._id)).populate({
                path: "userObj",
                strictPopulate: false
            });
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                data: actualCart,
                msg: "Cart Creation is Success"
            });
        }
    
    }catch(error){
        return ThrowError(response)
    }
};

/**
 * @usage : get Cart Info
 * @url : http://localhost:9000/api/carts/me
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getCart = async (request:Request, response:Response) => {
    try{
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            const theCart: any = await CartTable.findOne({userObj: new mongoose.Types.ObjectId(theUser._id)}).populate({
                path: 'products.productObj',
                strictPopulate: false
            }).populate({
                path: 'userObj',
                strictPopulate: false
            });
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                data: theCart,
                msg: ""
            })
        }
    }catch(error){
        return ThrowError(response)
    }
};
