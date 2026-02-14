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

export const routes = Router();

routes.post("/notes", validate(notePayloadSchema), createNote);
routes.get("/notes", validateQuery(noteQuerySchema), getNotes);
routes.get("/notes/:id", getNoteById);
routes.put(
    "/notes/:id",
    validate(noteUpdatePayloadSchema),
    editNoteById,
);
routes.delete("/notes/:id", deleteNoteById);
