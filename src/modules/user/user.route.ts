import { Router } from "express";
import auth from "../../middleware/auth";
import { UserController } from "./user.controller";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.get("/me", auth(), UserController.getMe);
router.get(
  "/",
  auth(Role.ADMIN),
  UserController.getAllUsers
);

export const UserRoutes = router;