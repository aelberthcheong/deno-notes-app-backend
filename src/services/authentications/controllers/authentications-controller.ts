import AuthenticationRepositories from "../repositories/authentications-repositories.ts";
import UserRepositories from "../../users/repositories/user-repositories.ts";
import TokenManager from "../../../security/token-manager.ts";
import response from "../../../utils/response.ts";
import InvariantError from "@/exceptions/invariant-error.ts";
import AuthenticationError from "@/exceptions/authentication-error.ts";
import { NextFunction, Request, Response } from "express";

export async function login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = (req as any).validatedBody;
    const userId = await UserRepositories.verifyUserCredential(
        username,
        password,
    );

    if (!userId) {
        return next(
            new AuthenticationError("Kredensial yang Anda berikan salah"),
        );
    }

    const accessToken = TokenManager.generateAccessToken({ id: userId });
    const refreshToken = TokenManager.generateRefreshToken({ id: userId });

    await AuthenticationRepositories.addRefreshToken(refreshToken);

    return response(res, 201, "Authentication berhasil ditambahkan", {
        accessToken,
        refreshToken,
    });
}

export async function refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { refreshToken } = (req as any).validatedBody;

    const result = await AuthenticationRepositories.verifyRefreshToken(
        refreshToken,
    );

    if (!result) {
        return next(new InvariantError("Refresh token tidak valid"));
    }

    const { id } = TokenManager.verifyRefreshToken(refreshToken);
    const accessToken = TokenManager.generateAccessToken({ id });

    return response(res, 200, "Access Token berhasil diperbarui", {
        accessToken,
    });
}

export async function logout(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = (req as any).validatedBody;

    const result = await AuthenticationRepositories.verifyRefreshToken(
        refreshToken,
    );

    if (!result) {
        return next(new InvariantError("Refresh token tidak valid"));
    }

    await AuthenticationRepositories.deleteRefreshToken(refreshToken);

    return response(res, 200, "Refresh token berhasil dihapus");
}
