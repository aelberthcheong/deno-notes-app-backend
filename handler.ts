import { nanoid } from "@sitnik/nanoid";
import { type Note, notes } from "./notes.ts";
import { RouterContext, Status } from "@oak/oak";

export async function addNote(ctx: RouterContext<string>): Promise<void> {
    const event = ctx.state.event;

    try {
        const { title = "untitled", tags, body } = await ctx.request.body
            .json();

        event.note_title_length = title.length;
        event.has_tags = !!tags;

        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const newNote: Note = { title, tags, body, id, createdAt, updatedAt };
        notes.push(newNote);

        event.note_id = id;

        ctx.response.status = Status.Created;
        ctx.response.body = {
            status: "success",
            message: "Catatan berhasil ditambahkan",
            data: { noteId: id },
        };
    } catch (err) {
        event.error_type = "JSON_PARSE_OR_VALIDATION_FAILURE";
        event.error_message = (err as Error).message;

        ctx.response.status = Status.InternalServerError;
        ctx.response.body = {
            status: "fail",
            message: "Catatan gagal ditambahkan",
        };
    }
}

export function getNotes(ctx: RouterContext<string>): void {
    const event = ctx.state.event;
    event.notes_length = notes.length;

    ctx.response.status = Status.OK;
    ctx.response.body = {
        status: "success",
        data: {
            notes,
        },
    };
}

export function getNoteById(ctx: RouterContext<string>): void {
    const event = ctx.state.event;

    try {
        const noteId = ctx.params.id;
        const note = notes.find((n) => n.id === noteId);

        event.note_found = !!note;
        event.note_id = noteId;

        if (!note) {
            ctx.response.status = Status.NotFound;
            ctx.response.body = {
                status: "fail",
                message: "Catatan tidak ditemukan",
            };
        } else {
            ctx.response.status = Status.OK;
            ctx.response.body = {
                status: "success",
                message: "Catatan berhasil ditemukan",
                data: {
                    note,
                },
            };
        }
    } catch (err) {
        event.error_type = "JSON_PARSE_OR_VALIDATION_FAILURE";
        event.error_message = (err as Error).message;

        ctx.response.status = Status.InternalServerError;
        ctx.response.body = {
            status: "fail",
            message: "Terjadi kesalahan server",
        };
    }
}

export async function editNoteById(ctx: RouterContext<string>): Promise<void> {
    const event = ctx.state.event;

    try {
        const noteId = ctx.params.id;
        const noteIndex = notes.findIndex((n) => n.id === noteId);

        event.note_id = noteId;
        event.note_index_found = noteIndex !== -1 ? true : false;

        const { title, tags, body } = await ctx.request.body.json();

        if (noteIndex === -1) {
            ctx.response.status = Status.NotFound;
            ctx.response.body = {
                status: "fail",
                message: "Gagal memperbarui catatan. Id tidak ditemukan",
            };
        } else {
            notes[noteIndex] = {
                ...notes[noteIndex],
                title: title ?? notes[noteIndex].title,
                tags: tags ?? notes[noteIndex].tags,
                body: body ?? notes[noteIndex].body,
                updatedAt: new Date().toISOString(),
            };

            event.note_title_length = notes[noteIndex].title.length;
            event.has_tags = !!notes[noteIndex].tags;

            ctx.response.status = Status.OK;
            ctx.response.body = {
                status: "success",
                message: "Catatan berhasil diperbarui",
            };
        }
    } catch (err) {
        event.error_type = "JSON_PARSE_OR_VALIDATION_FAILURE";
        event.error_message = (err as Error).message;

        ctx.response.status = Status.InternalServerError;
        ctx.response.body = {
            status: "fail",
            message: "Terjadi kesalahan server",
        };
    }
}

export function deleteNoteById(ctx: RouterContext<string>): void {
    const event = ctx.state.event;

    try {
        const noteId = ctx.params.id;
        const noteIndex = notes.findIndex((n) => n.id === noteId);

        event.note_id = noteId;
        event.note_index_found = noteIndex !== -1 ? true : false;

        if (noteIndex === -1) {
            ctx.response.status = Status.NotFound;
            ctx.response.body = {
                status: "fail",
                message: "Gagal menghapus catatan. Id tidak ditemukan",
            };
        } else {
            notes.splice(noteIndex, 1);
            ctx.response.status = Status.OK;
            ctx.response.body = {
                status: "success",
                message: "Catatan berhasil dihapus",
            };
        }

        event.notes_length = notes.length;
    } catch (err) {
        event.error_type = "JSON_PARSE_OR_VALIDATION_FAILURE";
        event.error_message = (err as Error).message;

        ctx.response.status = Status.InternalServerError;
        ctx.response.body = {
            status: "fail",
            message: "Terjadi kesalahan server",
        };
    }
}
