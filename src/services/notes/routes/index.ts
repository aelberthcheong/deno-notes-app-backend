import { Router } from "express";
import {
    createNote,
    deleteNoteById,
    editNoteById,
    getNoteById,
    getNotes,
} from "../controller/note-controller.ts";

export const routes = Router();

routes.post("/notes", createNote);
routes.get("/notes", getNotes);
routes.get("/notes/:id", getNoteById);
routes.put("/notes/:id", editNoteById);
routes.delete("/notes/:id", deleteNoteById);
