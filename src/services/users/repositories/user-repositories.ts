import { Pool } from "pg";
import { nanoid } from "@sitnik/nanoid";
import bcrypt from "bcryptjs";
import AuthenticationError from "../../../exceptions/authentication-error.ts";

class UserRepositories {
    private _pool: Pool;

    constructor() {
        this._pool = new Pool();
    }

    async createUser(
        { username, password, fullname }: {
            username: string;
            password: string;
            fullname: string;
        },
    ) {
        const id = nanoid(16);
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        const query = {
            text:
                "INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
            values: [
                id,
                username,
                hashedPassword,
                fullname,
                createdAt,
                updatedAt,
            ],
        };
        const result = await this._pool.query(query);
        return result.rows[0];
    }

    async verifyNewUsername(username: string) {
        const query = {
            text: "SELECT username FROM users WHERE username = $1",
            values: [username],
        };
        const result = await this._pool.query(query);
        return result.rows.length > 0;
    }

    async getUserById(id: string) {
        const query = {
            text: "SELECT * FROM users WHERE id = $1",
            values: [id],
        };
        const result = await this._pool.query(query);
        return result.rows[0];
    }

    async verifyUserCredential(username: string, password: string) {
        const query = {
            text: "SELECT id, password FROM users WHERE username = $1",
            values: [username],
        };
        const result = await this._pool.query(query);
        if (result.rows.length === 0) {
            throw new AuthenticationError("Kredensial yang Anda berikan salah");
        }
        const { id, password: hashedPassword } = result.rows[0];
        const match = await bcrypt.compare(password, hashedPassword);
        if (!match) {
            throw new AuthenticationError("Kredensial yang Anda berikan salah");
        }
        return id;
    }
}

export default new UserRepositories();
