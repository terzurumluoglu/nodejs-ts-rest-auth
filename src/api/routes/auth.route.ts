import express, { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router: Router = express.Router();

router.route('/login').post(login);

export { router as authRoute };