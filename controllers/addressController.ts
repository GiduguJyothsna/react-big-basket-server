import { Request, Response }from 'express';
import { ThrowError } from "../util/ErrorUtil";
import * as UserUtil from '../util/UserUtil';
import AddressTable from '../schemas/addressSchema';
import mongoose from 'mongoose';
import { IAddress } from '../models/IAddress';
import { APP_CONSTANTS } from '../constants';

/**
 * @usage : Create New Address
 * @url : http://localhost:9000/api/addresses/new
 * @body : mobile,flat,landmark,street,city,state,country,pinCode
 * @method : POST
 * @access : PRIVATE
 */
export const createNewAddress = async (request:Request, response:Response) => {
    try{
        const {mobile,flat,landmark,street,city,state,country,pinCode} = request.body;
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            // check if the address is exists for user
            const addressObj: any = await AddressTable.findOne({userObj: new mongoose.Types.ObjectId(theUser._id)});
            if(addressObj){
                await AddressTable.findByIdAndDelete(new mongoose.Types.ObjectId(addressObj._id));
            }else{
                // create 
                const theAddress: IAddress = {
                    name: theUser.username,
                    email: theUser.email,
                    mobile: mobile,
                    flat: flat,
                    landmark: landmark,
                    street: street,
                    city: city,
                    state: state,
                    country: country,
                    pinCode: pinCode,
                    userObj: theUser._id
                }
                const newAddress = await new AddressTable(theAddress).save();
                if(newAddress){
                    return response.status(200).json({
                        status: APP_CONSTANTS.SUCCESS,
                        data: newAddress,
                        msg: "New Shipping Address is added"
                    }); 
                }
            }
        }
    }catch(error){
        return ThrowError(response)
    }
};

/**
 * @usage : Update Address
 * @url : http://localhost:9000/api/addresses/:addressId
 * @body : mobile,flat,landmark,street,city,state,country,pinCode
 * @method : PUT
 * @access : PRIVATE
 */
export const updateAddress = async (request:Request, response:Response) => {
    try{
        const{addressId} = request.params;
        const mongoAddressId = new mongoose.Types.ObjectId(addressId);
        const {mobile,flat,landmark,street,city,state,country,pinCode} = request.body;
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            const theAddress: IAddress | null| undefined = await AddressTable.findById(mongoAddressId)
            if(!theAddress){
                return ThrowError(response, 404, "No Address Found")
            }
            const addressObj = await AddressTable.findByIdAndUpdate(mongoAddressId, {
                $set: {
                    name: theUser.username,
                    email: theUser.email,
                    mobile: mobile,
                    flat: flat,
                    landmark: landmark,
                    street: street,
                    city: city,
                    state: state,
                    country: country,
                    pinCode: pinCode,
                    userObj: theUser._id
                }
            }, {new : true});
            if(addressObj){
                return response.status(200).json({
                    status: APP_CONSTANTS.SUCCESS,
                    data: addressObj,
                    msg: "Shipping Address is Updated!"
                });
            }
        }
    }catch(error){
        return ThrowError(response)
    }
};

 /**
 * @usage : Get Address
 * @url : http://localhost:9000/api/addresses/me
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
 export const getAddress = async (request:Request, response:Response) => {
    try{
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            const addressObj: IAddress | null | undefined = await AddressTable.findOne({userObj: new mongoose.Types.ObjectId(theUser._id)});
            if(!addressObj){
                return response.status(404).json({msg: "No Address Found!"});
            }
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                data: addressObj,
                msg: "Address Found"
            });
        }

    }catch(error){
        return ThrowError(response)
    }
};
/**
 * @usage : Delete Address
 * @url : http://localhost:9000/api/addresses/:addressId
 * @body : no-params
 * @method : DELETE
 * @access : PRIVATE
 */
export const deleteAddress = async (request:Request, response:Response) => {
    try{
        const {addressId} = request.params;
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            const addressObj: IAddress | null | undefined = await AddressTable.findOne(new mongoose.Types.ObjectId(addressId));
            if(!addressObj){
                return ThrowError(response, 404, "No Address Found")
            }
            const theAddress = await AddressTable.findByIdAndDelete(new mongoose.Types.ObjectId(addressId));
            if(theAddress){
                return response.status(200).json({
                    status: APP_CONSTANTS.SUCCESS,
                    data: theAddress,
                    msg: "Shipping address is deleted!"
                });
            }
        }
    }catch(error){
        return ThrowError(response)
    }
};
 