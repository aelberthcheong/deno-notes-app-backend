import { Router } from "express";
import { createUser, getUserById } from "../controllers/user-controller.ts";
import { validate } from "../../../middlewares/validate.ts";
import { userPayloadSchema } from "../../../services/users/validator/schema.ts";

const router = Router();

router.post("/users", validate(userPayloadSchema), createUser);
router.get("/users/:id", getUserById);

export default router;
