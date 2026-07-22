import { Router } from "express";
import auth from "../../middleware/auth";
import { UserController } from "./user.controller";

const router = Router();

router.get("/me", auth(), UserController.getMe);

export const UserRoutes = router;