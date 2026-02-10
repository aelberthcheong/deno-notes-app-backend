import { nanoid } from "@sitnik/nanoid";
import { type Note, notes } from "@/services/notes/notes.ts";
import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "@/exceptions/index.ts";
import response from "@/utils/response.ts";

export function createNote(
    req: Request,
    res: Response,
) {
    const { title = "untitled", tags, body } = req.validatedBody;
    const id = nanoid(16);

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote: Note = { title, tags, body, id, createdAt, updatedAt };
    notes.set(id, newNote);

    return response(res, 201, "Catatan berhasil ditambahkan", { noteId: id });
}

export function getNotes(
    req: Request,
    res: Response,
) {
    const { title } = req.validatedQuery ?? {};

    let result = [...notes.values()];

    if (title) {
        result = result.filter((n) => n.title === title);
    }

    return response(res, 200, "Catatan berhasil ditampilkan", {
        notes: result,
    });
}

export function getNoteById(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { id } = req.params;
    const note = notes.get(id as string);

    if (!note) {
        return next(new NotFoundError("Catatan tidak ditemukan"));
    } else {
        return response(res, 200, "Catatan berhasil ditampilkan", {
            note: note,
        });
    }
}

export function editNoteById(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { id } = req.params;
    const note = notes.get(id as string);

    const { title, tags, body } = req.validatedBody;

    if (!note) {
        return next(new NotFoundError("Catatan tidak ditemukan"));
    } else {
        note.title = title ?? note.title;
        note.tags = tags ?? note.tags;
        note.body = body ?? note.body;
        note.updatedAt = new Date().toISOString();
        return response(res, 200, "Catatan berhasil diperbarui", {
            note: note,
        });
    }
}

export function deleteNoteById(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { id } = req.params;
    const note = notes.get(id as string);

    if (!note) {
        return next(
            new NotFoundError("Catatan tidak ditemukan"),
        );
    }

    notes.delete(id as string);
    return response(res, 200, "Catatan berhasil dihapus");
}
