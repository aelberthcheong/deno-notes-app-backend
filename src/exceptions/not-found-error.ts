import ClientError from "./client-error.ts";

export default class NotFoundError extends ClientError {
    constructor(msg: string) {
        super(msg, 404);
        this.name = "NotFoundError";
    }
}
