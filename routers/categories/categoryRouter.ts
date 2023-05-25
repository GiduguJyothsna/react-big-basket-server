import express, { Router, Request, Response }from 'express';
import { body } from "express-validator";
import { tokenVerifier } from '../../middlewares/tokenVerifier';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import * as categoryController from '../../controllers/categoryController';

/**
 * @usage : Create a Category
 * @url : http://localhost:9000/api/categories/
 * @body : name, description
 * @method : POST
 * @access : PRIVATE
 */
 
const categoryRouter:Router = Router();
categoryRouter.post("/", [
    body('name').not().isEmpty().withMessage("Name is required"),
    body('description').not().isEmpty().withMessage("description is required"),
], tokenVerifier,validationMiddleware, async (request:Request, response:Response) => {
    await categoryController.createCategory(request, response);
});
 
 /**
 * @usage : Create a Sub Category
 * @url : http://localhost:9000/api/categories/:categoryId
 * @body : name, description
 * @method : POST
 * @access : PRIVATE
 */
 categoryRouter.post("/:categoryId", [
    body('name').not().isEmpty().withMessage("Name is required"),
    body('description').not().isEmpty().withMessage("description is required"),
], tokenVerifier, validationMiddleware, async (request:Request, response:Response) => {
    await categoryController.createSubCategory(request, response);
});
/**
 * @usage : Get all categories
 * @url : http://localhost:9000/api/categories/
 * @body : no-params
 * @method : GET
 * @access : PUBLIC
 */
categoryRouter.get("/", async (request:Request, response:Response) => {
    await categoryController.getAllCategories(request, response);
}); 
export default categoryRouter;