import UserRepositories from "../repositories/user-repositories.ts";
import response from "../../../utils/response.ts";
import InvariantError from "../../../exceptions/invariant-error.ts";
import NotFoundError from "../../../exceptions/not-found-error.ts";
import { NextFunction, Request, Response } from "express";

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { username, password, fullname } = (req as any).validatedBody;

    const isUsernameExist = await UserRepositories.verifyNewUsername(username);
    if (isUsernameExist) {
        return next(
            new InvariantError(
                "Gagal menambahkan user. Username sudah digunakan.",
            ),
        );
    }

    const user = await UserRepositories.createUser({
        username,
        password,
        fullname,
    });

    if (!user) {
        return next(new InvariantError("User gagal ditambahkan"));
    }

    return response(res, 201, "User berhasil ditambahkan", user);
};

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params;
    const user = await UserRepositories.getUserById(id as string);

    if (!user) {
        return next(new NotFoundError("User tidak ditemukan"));
    }

    return response(res, 200, "User berhasil ditampilkan", user);
};
