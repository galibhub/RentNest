import { Router } from "express";
import auth from "../../middleware/auth";
import { UserController } from "./user.controller";
import { Role } from "../../../prisma/generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "./user.validation";

const router = Router();

router.get("/me", auth(), UserController.getMe);
router.get(
  "/",
  auth(Role.ADMIN),
  UserController.getAllUsers
);


router.patch(
  "/:id",
  auth(),
  validateRequest(UserValidation.updateProfileValidationSchema),
  UserController.updateProfile
);

export const UserRoutes = router;