import {Request, Response} from 'express';
import { ThrowError } from '../util/ErrorUtil';
import * as UserUtil from '../util/UserUtil';
import { IOrder } from '../models/IOrder';
import OrderTable from '../schemas/orderSchema';
import mongoose from 'mongoose';
import { APP_CONSTANTS } from '../constants';

/**
 * @usage : place an order
 * @url : http://localhost:9000/api/orders/place
 * @body : products[{product, count,price}],total,tax,grandTotal,paymentType
 * @method : POST
 * @access : PRIVATE
 */
export const createOrder = async (request:Request, response:Response) => {
    try{
        const {products,total,tax,grandTotal,paymentType} = request.body;
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            const newOrder: IOrder = {
                products: products,
                total: total,
                tax: tax,
                grandTotal: grandTotal,
                orderBy: theUser._id,
                paymentType: paymentType
            };
            const theOrder = await new OrderTable(newOrder).save();
            if(!theOrder){
                return response.status(400).json({msg: "Order Creation is failed"})
            }
            const actualOrder = await OrderTable.findById(new mongoose.Types.ObjectId(theOrder._id)).populate({
                path: "userObj",
                strictPopulate: false
            });
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                data: actualOrder,
                msg: "Order Creation is Success"
            });
        }  
    }catch(error){
        return ThrowError(response)
    }
};

 /**
 * @usage : get all orders
 * @url : http://localhost:9000/api/orders/all
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
 export const getAllOrders = async (request:Request, response:Response) => {
    try{
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            const orders: IOrder[] | any = await OrderTable.find().populate({
                path: 'products.productObj',
                strictPopulate: false
            }).populate({
                path: 'orderBy',
                strictPopulate: false
            }).sort({createdAt: 'descending'});
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                data: orders,
                msg: ""
            });
        }
    }catch(error){
        return ThrowError(response)
    }
};

/**
 * @usage : get my orders
 * @url : http://localhost:9000/api/orders/me
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getMyOrders = async (request:Request, response:Response) => {
    try{
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            const orders: IOrder[] | any = await OrderTable.find({orderBy: new mongoose.Types.ObjectId(theUser._id)}).populate({
                path: 'products.productObj',
                strictPopulate: false
            }).populate({
                path: 'orderBy',
                strictPopulate: false
            }).sort({createdAt: 'descending'});
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                data: orders,
                msg: ""
            })
        }
    }catch(error){
        return ThrowError(response)
    }
};

/**
 * @usage : update order status
 * @url : http://localhost:9000/api/orders/:orderId
 * @body : orderStatus
 * @method : POST
 * @access : PRIVATE
 */
export const updateOrderStatus = async (request:Request, response:Response) => {
    try{
    const {orderStatus} = request.body;
    const {orderId} = request.params;
    const mongoOrderId = new mongoose.Types.ObjectId(orderId);
    const theUser: any = await UserUtil.getUser(request, response);
    if(theUser){
        const theOrder : IOrder | any = await OrderTable.findById(mongoOrderId);
        if(!theOrder){
            return response.status(401).json({msg: "No Order found"});
        }
        theOrder.orderStatus = orderStatus;
        await theOrder.save();
        const theActualOrder = await OrderTable.findById(mongoOrderId).populate({
            path: "orderBy",
            strictPopulate: false
        }).populate({
            path: 'products.product',
            strictPopulate: false
        });
        return response.status(200).json({
            status: APP_CONSTANTS.SUCCESS,
            data: theActualOrder,
            msg: " Order status is Updated"
        })
    }
    }catch(error){
        return ThrowError(response)
    }
};

