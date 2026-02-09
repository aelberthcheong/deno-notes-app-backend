import { Response } from "express";

export default function response(
    res: Response,
    statusCode: number,
    msg: string,
    data?: any,
) {
    return res.status(statusCode).json({
        code: statusCode,
        status: statusCode >= 400 ? "failed" : "success",
        message: msg,
        data: data,
    }).end();
}
