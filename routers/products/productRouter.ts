import express, { Router, Request, Response }from 'express';
import { body } from "express-validator";
import { tokenVerifier } from '../../middlewares/tokenVerifier';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import * as productController from '../../controllers/productController';

const productRouter:Router = Router();
/**
 * @usage : Create a Product
 * @url : http://localhost:9000/api/products/
 * @body : title, description, imageUrl, price, quantity, categoryId, subCategoryId
 * @method : POST
 * @access : PRIVATE
 */

productRouter.post("/", [
    body('title').not().isEmpty().withMessage("title is required"),
    body('description').not().isEmpty().withMessage("description is required"),
    body('imageUrl').not().isEmpty().withMessage("imageUrl is required"),
    body('price').not().isEmpty().withMessage("price is required"),
    body('quantity').not().isEmpty().withMessage("quantity is required"),
    body('categoryId').not().isEmpty().withMessage("categoryId is required"),
    body('subCategoryId').not().isEmpty().withMessage("subCategoryId is required"),
], tokenVerifier, validationMiddleware, async (request:Request, response:Response) => {
    await productController.createProduct(request, response);
});

/**
 * @usage : Update a Product
 * @url : http://localhost:9000/api/products/:productId
 * @body : title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId
 * @method : PUT
 * @access : PRIVATE
 */
productRouter.put("/:productId", [
    body('title').not().isEmpty().withMessage("title is required"),
    body('description').not().isEmpty().withMessage("description is required"),
    body('imageUrl').not().isEmpty().withMessage("imageUrl is required"),
    body('price').not().isEmpty().withMessage("price is required"),
    body('quantity').not().isEmpty().withMessage("quantity is required"),
    body('categoryId').not().isEmpty().withMessage("categoryId is required"),
    body('subCategoryId').not().isEmpty().withMessage("subCategoryId is required"),
], tokenVerifier, validationMiddleware, async (request:Request, response:Response) => {
    await productController.updateProduct(request, response);
});

 /**
 * @usage : Get all Products
 * @url : http://localhost:9000/api/products/
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
 productRouter.get("/", tokenVerifier, async (request:Request, response:Response) => {
    await productController.getAllProducts(request, response);
});

/**
 * @usage : Get a Product
 * @url : http://localhost:9000/api/products/:productId
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
productRouter.get("/:productId", tokenVerifier, async (request:Request, response:Response) => {
    await productController.getProduct(request, response);
});

/**
 * @usage : Delete a Product
 * @url : http://localhost:9000/api/products/:productId
 * @body : no-params
 * @method : DELETE
 * @access : PRIVATE
 */
productRouter.delete("/:productId", tokenVerifier, async (request:Request, response:Response) => {
    await productController.deleteProduct(request, response);
});

/**
 * @usage : Get all products with category Id
 * @url : http://localhost:9000/api/products/categories/:categoryId
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
productRouter.get("/categories/:categoryId", tokenVerifier, async (request:Request, response:Response) => {
    await productController.getAllProductsWithCategoryId(request, response);
});

export default productRouter;