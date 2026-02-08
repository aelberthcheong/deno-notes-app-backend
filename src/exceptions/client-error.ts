export default class ClientError extends Error {
    statusCode: number;

    constructor(msg: string, statusCode: number = 400) {
        super(msg);
        this.name = "ClientError";
        this.statusCode = statusCode;
    }
}
