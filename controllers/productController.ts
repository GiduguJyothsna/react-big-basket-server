import {Request, Response} from 'express';
import { ThrowError } from '../util/ErrorUtil';
import * as UserUtil from '../util/UserUtil';
import { IProduct } from '../models/IProduct';
import ProductTable from '../schemas/productSchema';
import { APP_CONSTANTS } from '../constants';
import mongoose from 'mongoose';

/**
 * @usage : Create a Product
 * @url : http://localhost:9000/api/products/
 * @body : title, description, imageUrl, price, quantity, categoryId, subCategoryId
 * @method : POST
 * @access : PRIVATE
 */
export const createProduct = async (request:Request, response:Response) => {
    try{
        const {title, description, imageUrl, price, quantity, categoryId, subCategoryId} = request.body;
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
        // check if the same product exists
            const theProduct: IProduct | null | undefined = await ProductTable.findOne({title: title});
            if(theProduct){
                return response.status(401).json({msg: "The Product is already exists!"});
            }
            const newProduct: IProduct= {
                title: title,
                description: description,
                imageUrl: imageUrl,
                price: price,
                quantity: quantity,
                categoryObj: categoryId,
                subCategoryObj: subCategoryId,
                userObj: theUser._id
            };
            const createdProduct = await new ProductTable(newProduct).save();
            if(createdProduct){
                return response.status(200).json({
                    status: APP_CONSTANTS.SUCCESS,
                    data: createdProduct,
                    msg: "Product is Created Successfully"
                });
            }
        }
    
    }catch(error){
        return ThrowError(response)
    }
};

/**
 * @usage : Update a Product
 * @url : http://localhost:9000/api/products/:productId
 * @body : title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId
 * @method : PUT
 * @access : PRIVATE
 */
export const updateProduct = async (request:Request, response:Response) => {
    try{
        const {title, description, imageUrl, price, quantity, categoryId, subCategoryId} = request.body;
        const {productId} = request.params;
        const mongoProductId = new mongoose.Types.ObjectId(productId);
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
        // check if the same product exists
            const theProduct: IProduct | null | undefined = await ProductTable.findOne({title: title});
            if(!theProduct){
                return response.status(404).json({msg: "The Product is not exists!"});
            }
            const newProduct: IProduct= {
                title: title,
                description: description,
                imageUrl: imageUrl,
                price: price,
                quantity: quantity,
                categoryObj: categoryId,
                subCategoryObj: subCategoryId,
                userObj: theUser._id
            };
            const updatedProduct = await ProductTable.findByIdAndUpdate(mongoProductId, {
                $set: newProduct
            }, {new: true})
            if(updatedProduct){
                return response.status(200).json({
                    status: APP_CONSTANTS.SUCCESS,
                    data: updatedProduct,
                    msg: "Product is Updated Successfully"
                });
            }
        }  
    }catch(error){
        return ThrowError(response)
    }
};

/**
 * @usage : Get all Products
 * @url : http://localhost:9000/api/products/
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getAllProducts = async (request:Request, response:Response) => {
    try{
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            const theProducts: IProduct[] | any = await ProductTable.find().populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            })
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                data: theProducts,
                msg: ""
            });
        } 
    }catch(error){
        return ThrowError(response)
    }
};

/**
 * @usage : Get a Product
 * @url : http://localhost:9000/api/products/:productId
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getProduct = async (request:Request, response:Response) => {
    try{
        const {productId} = request.params;
        const mongoProductId = new mongoose.Types.ObjectId(productId);
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            const theProduct: IProduct | any = await ProductTable.findById(mongoProductId).populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            });
            if(!theProduct){
                return response.status(40).json({msg: "The Product is not found"})
            }
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                data: theProduct ,
                msg: ""
            });
        }    
    }catch(error){
        return ThrowError(response)
    }
};

/**
 * @usage : Delete a Product
 * @url : http://localhost:9000/api/products/:productId
 * @body : no-params
 * @method : DELETE
 * @access : PRIVATE
 */
export const deleteProduct = async (request:Request, response:Response) => {
    try{
        const {productId} = request.params;
        const mongoProductId = new mongoose.Types.ObjectId(productId);
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            const theProduct: IProduct | any = await ProductTable.findById(mongoProductId).populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            });
            if(!theProduct){
                return response.status(40).json({msg: "The Product is not found"})
            }
            const deletedProduct = await ProductTable.findByIdAndDelete(mongoProductId);
            if(deleteProduct){
                return response.status(200).json({
                    status: APP_CONSTANTS.SUCCESS,
                    data: deleteProduct ,
                    msg: "Th Product is Deleted!"
                });
            }
        }      
    }catch(error){
        return ThrowError(response)
    }
};

/**
 * @usage : Get all products with category Id
 * @url : http://localhost:9000/api/products/categories/:categoryId
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getAllProductsWithCategoryId = async (request:Request, response:Response) => {
    try{
        const {categoryId} = request.params;
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            const products: IProduct[] | any = await ProductTable.find({categoryObj: categoryId}).populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            });
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                data: products,
                msg: ""
            })
        }
    }catch(error){
        return ThrowError(response)
    }
};