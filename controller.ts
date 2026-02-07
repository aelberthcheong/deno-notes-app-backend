import { nanoid } from "@sitnik/nanoid";
import { type Note, notes } from "./notes.ts";
import { Request, Response } from "express";

export function createNote(
    req: Request,
    res: Response,
): void {
    const { title = "untitled", tags, body } = req.body;
    const id = nanoid(16);

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote: Note = { title, tags, body, id, createdAt, updatedAt };
    notes.set(id, newNote);

    res.status(201).json({
        status: "success",
        message: "Catatan berhasil ditambahkan",
        data: { noteId: id },
    });
}

export function getNotes(
    _req: Request,
    res: Response,
): void {
    res.status(200).json({
        status: "success",
        data: { ...Object.fromEntries(notes) },
    });
}

export function getNoteById(
    req: Request,
    res: Response,
): void {
    const { id } = req.params;
    const note = notes.get(id as string);

    if (!note) {
        res.status(404).json({
            status: "fail",
            message: "Catatan tidak ditemukan",
        });
    } else {
        res.status(200).json({
            status: "success",
            message: "Catatan berhasil ditemukan",
            data: { ...Object.fromEntries(notes) },
        });
    }
}

export function editNoteById(req: Request, res: Response): void {
    const { id } = req.params;
    const note = notes.get(id as string);

    const { title, tags, body } = req.body;

    if (!note) {
        res.status(404).json({
            status: "fail",
            message: "Gagal memperbarui catatan. Id tidak ditemukan",
        });
    } else {
        note.title = title ?? note.title;
        note.tags = tags ?? note.tags;
        note.body = body ?? note.body;
        note.updatedAt = new Date().toISOString();

        res.status(200).json({
            status: "success",
            message: "Catatan berhasil diperbarui",
        });
    }
}

export function deleteNoteById(req: Request, res: Response): void {
    const { id } = req.params;
    const note = notes.get(id as string);

    if (!note) {
        res.status(404).json({
            status: "fail",
            message: "Gagal memperbarui catatan. Id tidak ditemukan",
        });
    } else {
        notes.delete(id[0]);
        res.status(200).json({
            status: "success",
            message: "Catatan berhasil dihapus",
        });
    }
}
