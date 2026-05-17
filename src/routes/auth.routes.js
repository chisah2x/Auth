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

/** Login user
 * @route POST /api/auth/login
 * @body { usernameOrEmail, password }
 * @returns { accessToken: <token>, refreshToken: <token> }
 */
authRouter.post('/login', authController.login);


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

/** Logout user
 * @route GET /api/auth/logout
 * @cookie refreshToken=<token>
 * @returns { message: "Logged out successfully" }
 */
authRouter.get("/logout", authController.logout);

/** Logout user from all devices
 * @route GET /api/auth/logout-all
 * @description Revokes all active sessions for the authenticated user across all devices
 * @cookie refreshToken=<token> (used to identify the user)
 * @returns { message: "Logged out from all devices successfully" }
 */
authRouter.get("/logout-all", authController.logoutAll);

/** Verify email using OTP
 * @route POST /api/auth/verify-email
 * @body { email, otp }
 * @description Validates OTP and marks user email as verified. Deletes all OTP records after verification.
 * @returns { message: "Email verified successfully, redirected to login page", user: { username, email, verified } }
 */
authRouter.post("/verify-email", authController.verifyEmail);

export default authRouter;