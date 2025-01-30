import { Router } from "express";
import { forgotPassword, login, resetPassword } from "../controllers/auth.controller";
import { validateForgotPassword, validateLogin } from "../middlewares/validation.middleware";

const router = Router();

router.post('/login', validateLogin, login);

router.post('/forgot-password', validateForgotPassword, forgotPassword);

router.post('/reset-password', resetPassword)

export default router;
