import response from "@/utils/response.ts";
import { ClientError } from "@/exceptions/index.ts";
import { NextFunction, Request, Response } from "express";

export default function errorHandler(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    if (err instanceof ClientError) {
        return response(res, err.statusCode, err.message, null);
    }

    if (err.isJoi) {
        return response(res, 400, err.details[0].message, null);
    }

    const status = err.statusCode || err.status || 500;
    const message = err.message || "Internal Server Error";

    console.error("Unhandled error:", err);
    return response(res, status, message, null);
}
