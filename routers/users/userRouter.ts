import { Router, Request, Response }from 'express';
import { tokenVerifier } from '../../middlewares/tokenVerifier';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import * as userController from '../../controllers/userController';
import { body } from "express-validator";

const userRouter:Router = Router();

/**
 * @usage : Register a User
 * @url : http://localhost:9000/api/users/register
 * @body : username , email , password
 * @method : POST
 * @access : PUBLIC
 */
userRouter.post("/register", [
    body('username').not().isEmpty().withMessage("username is required"),
    body('email').isEmail().withMessage("email is required"),
    body('password').isStrongPassword().withMessage("Strong password is required"),
], validationMiddleware, async (request:Request, response:Response) => {
    await userController.registerUser(request, response);
});

/**
 * @usage : Login a User
 * @url : http://localhost:9000/api/users/login
 * @body : email , password
 * @method : POST
 * @access : PUBLIC
 */
userRouter.post("/login", [
    body('email').isEmail().withMessage("email is required"),
    body('password').isStrongPassword().withMessage("Strong password is required"),
], validationMiddleware, async (request:Request, response:Response) => {
    await userController.loginUser(request, response);
});

/**
 *  @usage : get users Data
 *  @url : http://localhost:9000/api/users/me
 *  @method : GET
 *  @param : no-params
 *  @access : PRIVATE
 */
userRouter.get("/me", tokenVerifier, async (request:Request, response:Response) => {
    await userController.getUsersData(request, response);
});
/**
 * @usage : update profile Picture
 * @url : http://localhost:9000/api/users/profile
 * @body : imageUrl
 * @method : POST
 * @access : PRIVATE
 */
userRouter.post("/profile", [
    body('imageUrl').not().isEmpty().withMessage("Image Url is Required"),
], tokenVerifier, validationMiddleware, async (request: Request, response: Response) => {
    await userController.updateProfilePicture(request, response);
});

/**
 * @usage : change the password
 * @url : http://localhost:9000/api/users/change-password
 * @body : password
 * @method : POST
 * @access : PRIVATE
 */
userRouter.post("/change-password", [
    body('password').isStrongPassword().withMessage("Strong Password is required"),
], tokenVerifier, validationMiddleware, async (request:Request, response:Response) => {
    await userController.changePassword(request, response);
});
export default userRouter;