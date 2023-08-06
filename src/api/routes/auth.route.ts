import express, { Router } from 'express';
import { forgotPassword, login, logout, register, resetPassword, token } from '../controllers/auth.controller';
import { asyncHandler } from '../middlewares/asyncHandler';

const router: Router = express.Router();

router.route('/login').post(asyncHandler(login));
router.route('/register').post(asyncHandler(register));
router.route('/forgotpassword').post(asyncHandler(forgotPassword));
router.route('/resetpassword/:resetPasswordKey').post(asyncHandler(resetPassword));
router.route('/token').post(asyncHandler(token));
router.route('/logout').post(asyncHandler(logout));

export { router as authRoute };