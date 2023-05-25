import express, { Router, Request, Response }from 'express';
import { body } from "express-validator";
import { tokenVerifier } from '../../middlewares/tokenVerifier';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import * as cartController from '../../controllers/cartController';

const cartRouter:Router = Router();

/**
 * @usage : create a Cart
 * @url : http://localhost:9000/api/carts/
 * @body :products[{product, count,price}],total,tax,grandTotal
 * @method : POST
 * @access : PRIVATE
 */
cartRouter.post("/", [
    body('products').not().isEmpty().withMessage("products is required"),
    body('total').not().isEmpty().withMessage("total is required"),
    body('tax').not().isEmail().withMessage("tax is required"),
    body('grandTotal').not().isEmpty().withMessage("grandTotal is required"),
], tokenVerifier,validationMiddleware, async (request:Request, response:Response) => {
    await cartController.createCart(request, response);
});

/**
 * @usage : get Cart Info
 * @url : http://localhost:9000/api/carts/me
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
cartRouter.get("/me", tokenVerifier,validationMiddleware, async (request:Request, response:Response) => {
    await cartController.getCart(request, response);
});

export default cartRouter;