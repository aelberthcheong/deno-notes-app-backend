import {
    login,
    logout,
    refreshToken,
} from "../controllers/authentications-controller.ts";
import { validate } from "@/middlewares/validate.ts";
import {
    deleteAuthenticationPayloadSchema,
    postAuthenticationPayloadSchema,
    putAuthenticationPayloadSchema,
} from "../validator/schema.ts";
import { Router } from "express";

const router = Router();

router.post(
    "/authentications",
    validate(postAuthenticationPayloadSchema),
    login,
);

router.put(
    "/authentications",
    validate(putAuthenticationPayloadSchema),
    refreshToken,
);

router.delete(
    "/authentications",
    validate(deleteAuthenticationPayloadSchema),
    logout,
);

export default router;
