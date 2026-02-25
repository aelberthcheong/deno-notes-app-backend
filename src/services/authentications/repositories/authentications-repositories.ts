import { Pool } from "pg";

class AuthenticationRepositories {
    pool: Pool;

    constructor() {
        this.pool = new Pool();
    }

    async addRefreshToken(token: string) {
        const query = {
            text: "INSERT INTO authentications VALUES($1)",
            values: [token],
        };

        await this.pool.query(query);
    }

    async deleteRefreshToken(token: string) {
        const query = {
            text: "DELETE FROM authentications WHERE token = $1",
            values: [token],
        };
        await this.pool.query(query);
    }

    async verifyRefreshToken(token: string) {
        const query = {
            text: "SELECT token FROM authentications WHERE token = $1",
            values: [token],
        };

        const result = await this.pool.query(query);
        if (!result.rows.length) {
            return false;
        }

        return result.rows[0];
    }
}

export default new AuthenticationRepositories();
