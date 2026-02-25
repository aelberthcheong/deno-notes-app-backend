import { Router } from "express";
import { routes as notes } from "@/services/notes/routes/index.ts";
import users from "../services/users/routes/index.ts";
import authentications from "../services/authentications/routes/indexs.ts";

const router = Router();

router.use("/", notes);
router.use("/", users);
router.use("/", authentications);

export default router;
