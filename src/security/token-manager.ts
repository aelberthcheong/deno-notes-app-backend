import jwt from "jsonwebtoken";
import process from "node:process";
import InvariantError from "../exceptions/invariant-error.ts";

const TokenManager = {
    generateAccessToken: (payload: any) =>
        jwt.sign(payload, process.env.ACCESS_TOKEN_KEY),
    generateRefreshToken: (payload: any) =>
        jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),
    verifyRefreshToken: (refreshToken: any) => {
        try {
            const payload = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_KEY,
            );
            return payload;
        } catch (error) {
            console.log(error);
            throw new InvariantError("Refresh token tidak valid");
        }
    },
    verify: (token: string, secret: string) => {
        try {
            const payload = jwt.verify(token, secret);
            return payload;
        } catch (error) {
            console.log(error);
            throw new InvariantError("Token tidak valid");
        }
    },
};

export default TokenManager;
