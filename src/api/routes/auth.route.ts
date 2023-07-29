import express, { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { asyncHandler } from '../middlewares/asyncHandler';

const router: Router = express.Router();

router.route('/login').post(asyncHandler(login));

export { router as authRoute };