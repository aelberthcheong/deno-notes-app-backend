import ClientError from "./client-error.ts";

export default class InvariantError extends ClientError {
    constructor(msg: string) {
        super(msg);
        this.name = "InvariantError";
    }
}
