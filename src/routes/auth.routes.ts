import { Router } from "express";
import { ROUTE } from "@/constants/routes";
import { register, login } from "@/controllers/auth.controller";

const router = Router();

router.post(ROUTE.REGISTER, register);
router.post(ROUTE.LOGIN, login);

export default router;
