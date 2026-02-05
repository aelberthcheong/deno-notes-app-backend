import { Context, Next } from "@oak/oak";
import { nanoid } from "@sitnik/nanoid";
import { Status } from "jsr:@oak/commons@1/status";

export async function wideEventLogger(ctx: Context, next: Next) {
    const start = performance.now();

    ctx.state.event = {
        trace_id: nanoid(8),
        method: ctx.request.method,
        url: ctx.request.url.pathname,
        user_agent: ctx.request.headers.get("user_agent"),
        app_version: "1.0.0",
        environment: Deno.env.get("NODE_ENV") || "development",
    };

    try {
        await next();
    } catch (err) {
        // Di typescript, catch clause memiliki tipe unknown.
        // Untuk memperbaiki error ini, cast err menjadi Error interface.
        ctx.state.event.error = (err as Error).message;
        ctx.state.event.error = (err as Error).stack;
        ctx.response.status = Status.InternalServerError;
        ctx.response.body = {
            status: "error",
            message: "Internal Server Error",
        };
    } finally {
        ctx.state.event.duration_ms = Math.round(performance.now() - start);
        ctx.state.event.status_code = ctx.response.status;
        ctx.state.event.success = ctx.response.status >= 200 &&
            ctx.response.status < 300;

        // Dalam production mode, log akan dikirimkan ke HoneyComb/Datadog/Elastic.
        // Untuk saat ini, print aja log dalam bentuk json ke stdout.
        console.log(JSON.stringify(ctx.state.event));
    }
}
