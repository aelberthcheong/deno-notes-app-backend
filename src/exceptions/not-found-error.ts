import ClientError from "../exceptions/client-error.ts";

export default class NotFoundError extends ClientError {
    constructor(msg: string) {
        super(msg, 404);
        this.name = "NotFoundError";
    }
}
