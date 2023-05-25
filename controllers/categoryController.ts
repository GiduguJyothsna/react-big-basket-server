import {Request, Response} from 'express';
import { ThrowError } from '../util/ErrorUtil';
import * as UserUtil from '../util/UserUtil';
import { ICategory, ISubCategory } from '../models/ICategory';
import { CategoryTable, SubCategoryTable } from '../schemas/categorySchema';
import { APP_CONSTANTS } from '../constants';
import mongoose from 'mongoose';

/**
 * @usage : Create a Category
 * @url : http://localhost:9000/api/categories/
 * @body : name, description
 * @method : POST
 * @access : PRIVATE
 */
export const createCategory = async (request:Request, response:Response) => {
    try{
        const{name, description} = request.body;
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            // check if the category is exists
            const categoryObj: ICategory | null | undefined = await CategoryTable.findOne({name:name});
            if(categoryObj){
                return response.status(401).json({msg: "Category is Already exists!"});
            }
            // create
            const theCategory: ICategory = {
                name: name,
                description: description,
                subCategories: [] as ISubCategory[]
            }
            const savedCategory = await new CategoryTable(theCategory).save();
            if(savedCategory){
                return response.status(200).json({
                    status: APP_CONSTANTS.SUCCESS,
                    data: savedCategory,
                    msg: "New Category is Created!"
                })
            }
        }
    }catch(error){
        return ThrowError(response)
    }
};
 
 /**
 * @usage : Create a Sub Category
 * @url : http://localhost:9000/api/categories/:categoryId
 * @body : name, description
 * @method : POST
 * @access : PRIVATE
 */
 export const createSubCategory = async (request:Request, response:Response) => {
    try{
        const {categoryId} = request.params;
        const mongoCategoryId = new mongoose.Types.ObjectId(categoryId);
        const{name, description} = request.body;
        const theUser: any = await UserUtil.getUser(request, response);
        if(theUser){
            // check if the sub category is exists 
            let theCategory: ICategory | null | undefined | any= await CategoryTable.findById(mongoCategoryId);
            if(!theCategory){
                return response.status(404).json({msg: "Category is not exists!"});
            }
            let theSubCategory: any = await SubCategoryTable.findOne({name: name});
            if(theSubCategory){
                return response.status(404).json({msg: "SubCategory is already exists!"});
            } 
            let theSub = await new SubCategoryTable({name: name, description: description}).save();
            if(theSub){
                theCategory.subCategories.push(theSub);
                let categoryObj= await theCategory.save();
                if(categoryObj){
                    return response.status(201).json({
                        msg: "Sub Category is Created",
                        data: categoryObj,
                        status: APP_CONSTANTS.SUCCESS
                    });
                }
            }
        }
    }catch(error){
        return ThrowError(response)
    }
};

 /**
 * @usage : Get all categories
 * @url : http://localhost:9000/api/categories/
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
 export const getAllCategories = async (request:Request, response:Response) => {
    try{
        const categories = await CategoryTable.find().populate({
            path: "subCategories",
            strictPopulate: false
        });
        return response.status(200).json({
            status: APP_CONSTANTS.SUCCESS,
            data: categories,
            msg: " Categories Found"
        })
    }catch(error){
        return ThrowError(response)
    }
};