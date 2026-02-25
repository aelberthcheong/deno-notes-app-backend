import TokenManager from "../security/token-manager.ts";
import response from "../utils/response.ts";
import process from "node:process";
import { NextFunction, Request, Response } from "express";

async function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const token = req.headers.authorization;
    if (token && token.indexOf("Bearer ") !== -1) {
        try {
            const user = await TokenManager.verify(
                token.split("Bearer ")[1],
                process.env.ACCESS_TOKEN_KEY!,
            );
            (req as any).user = user;
            return next();
        } catch (error) {
            return response(res, 401, (error as Error).message, null);
        }
    }

    return response(res, 401, "Unauthorized", null);
}

export default authenticateToken;
