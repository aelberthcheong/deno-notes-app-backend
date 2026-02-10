import { Router } from "express";
import { routes as notes } from "@/services/notes/routes/index.ts";

const router = Router();

router.use("/", notes);

export default router;
