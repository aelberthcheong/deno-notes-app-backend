import NoteRepositories from "@/services/notes/repositories/note-repositories.ts";
import { NextFunction, Request, Response } from "express";
import {
    AuthorizationError,
    InvariantError,
    NotFoundError,
} from "@/exceptions/index.ts";
import response from "@/utils/response.ts";
import noteRepositories from "../repositories/note-repositories.ts";

export async function createNote(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { title = "untitled", tags, body } = (req as any).validatedBody;
    const { id: owner } = req.user;
    const note = await NoteRepositories.createNote({
        title,
        body,
        tags,
        owner,
    });

    if (!note) {
        next(new InvariantError("Catatan gagal ditemukan"));
    }

    return response(res, 201, "Catatan berhasil ditambahkan", note);
}

export async function getNotes(
    req: Request,
    res: Response,
) {
    const { id: owner } = req.user;
    const notes = await NoteRepositories.getNotes(owner);
    return response(res, 200, "Catatan berhasil ditampilkan", notes);
}

export async function getNoteById(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { id } = req.params;
    const { id: owner } = req.user;

    const isOwner = await noteRepositories.verifyNoteOwner(id as string, owner);

    if (!isOwner) {
        return next(
            new AuthorizationError("Anda tidak berhak mengakses resource ini"),
        );
    }

    const note = await NoteRepositories.getNotesById(id as string);

    if (!note) {
        return next(new NotFoundError("Catatan tidak ditemukan"));
    }

    return response(res, 200, "Catatan berhasil ditampilkan", note);
}

export async function editNoteById(
    req: Request<any>,
    res: Response,
    next: NextFunction,
) {
    const { id } = req.params;
    const { title, tags, body } = (req as any).validatedBody;
    const note = await noteRepositories.editNoteById({
        id,
        title,
        body,
        tags,
    });

    const { id: owner } = req.user;

    const isOwner = await noteRepositories.verifyNoteOwner(id as string, owner);
    if (!isOwner) {
        return next(
            new AuthorizationError("Anda tidak berhak mengakses resource ini"),
        );
    }

    if (!note) {
        return next(new NotFoundError("Catatan tidak ditemukan"));
    }

    return response(res, 200, "Catatan berhasil diperbarui", note);
}

export async function deleteNoteById(
    req: Request<any>,
    res: Response,
    next: NextFunction,
) {
    const { id } = req.params;
    const { id: owner } = req.user;

    const isOwner = await NoteRepositories.verifyNoteOwner(id as string, owner);
    if (!isOwner) {
        return next(
            new AuthorizationError("Anda tidak berhak mengakses resource ini"),
        );
    }

    const deletedNote = await noteRepositories.deleteNoteById(id);

    if (!deletedNote) {
        return next(
            new NotFoundError("Catatan tidak ditemukan"),
        );
    }

    return response(res, 200, "Catatan berhasil dihapus");
}
