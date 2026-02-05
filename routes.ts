import { Router } from "@oak/oak";
import * as Handler from "./handler.ts";

export const router = new Router();

router
    .post("/notes", Handler.addNote)
    .get("/notes", Handler.getNotes)
    .get("/notes/:id", Handler.getNoteById)
    .put("/notes/:id", Handler.editNoteById)
    .delete("/notes/:id", Handler.deleteNoteById);
