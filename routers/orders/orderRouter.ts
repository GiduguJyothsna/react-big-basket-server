import express, { Router, Request, Response }from 'express';
import { body } from "express-validator";
import { tokenVerifier } from '../../middlewares/tokenVerifier';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import * as orderController from '../../controllers/orderController';


const orderRouter:Router = Router();

/**
 * @usage : place an order
 * @url : http://localhost:9000/api/orders/place
 * @body : products[{product, count,price}],total,tax,grandTotal,paymentType
 * @method : POST
 * @access : PRIVATE
 */
orderRouter.post("/place", [
    body('products').not().isEmpty().withMessage("products is required"),
    body('total').not().isEmpty().withMessage("total is required"),
    body('tax').not().isEmail().withMessage("tax is required"),
    body('grandTotal').not().isEmpty().withMessage("grandTotal is required"),
    body('paymentType').not().isEmpty().withMessage("paymentType is required"),
], tokenVerifier,validationMiddleware, async (request:Request, response:Response) => {
    await orderController.createOrder(request, response);
});

 /**
 * @usage : get all orders
 * @url : http://localhost:9000/api/orders/all
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
 orderRouter.get("/all", tokenVerifier,validationMiddleware, async (request:Request, response:Response) => {
    await orderController.getAllOrders(request, response);
});

/**
 * @usage : get my orders
 * @url : http://localhost:9000/api/orders/me
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
orderRouter.get("/me", tokenVerifier,validationMiddleware, async (request:Request, response:Response) => {
    await orderController.getMyOrders(request, response);
});

/**
 * @usage : update order status
 * @url : http://localhost:9000/api/orders/:orderId
 * @body : orderStatus
 * @method : POST
 * @access : PRIVATE
 */
orderRouter.put("/:orderId", tokenVerifier,validationMiddleware, async (request:Request, response:Response) => {
    await orderController.updateOrderStatus(request, response);
});
export default orderRouter;