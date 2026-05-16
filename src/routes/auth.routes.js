import {Router} from "express";
/*equal to: 
import express from "express";
const authRouter = express.Router();
*/
import * as authController from "../controllers/auth.controller.js";

const authRouter = Router();

/** Register a new user 
 * @route POST /api/auth/register
 * @body { username, email, password }
 * @returns { user: { username, email } }
 */

authRouter.post('/register', authController.register);

/** Get current user info
 * @route GET /api/auth/get-me
 * @header Authorization: Bearer <token>
 * @returns { user: { username, email } }
 */
authRouter.get("/get-me", authController.getMe);

/** Refresh access token using refresh token cookie
 * @route GET /api/auth/refresh-token
 * @cookie refreshToken=<token>
 * @returns { accessToken: <new token> }
 */
authRouter.get("/refresh-token", authController.refreshToken);

export default authRouter;