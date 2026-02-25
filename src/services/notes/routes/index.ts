import { Router } from "express";
import {
    createNote,
    deleteNoteById,
    editNoteById,
    getNoteById,
    getNotes,
} from "../controller/note-controller.ts";
import { validate, validateQuery } from "../../../middlewares/validate.ts";
import {
    notePayloadSchema,
    noteQuerySchema,
    noteUpdatePayloadSchema,
} from "../validator/schema.ts";
import authenticateToken from "../../../middlewares/auth.ts";

export const routes = Router();

routes.post(
    "/notes",
    authenticateToken,
    validate(notePayloadSchema),
    createNote,
);
routes.get(
    "/notes",
    authenticateToken,
    validateQuery(noteQuerySchema),
    getNotes,
);
routes.get("/notes/:id", authenticateToken, getNoteById);
routes.put(
    "/notes/:id",
    authenticateToken,
    validate(noteUpdatePayloadSchema),
    editNoteById,
);
routes.delete("/notes/:id", authenticateToken, deleteNoteById);
