import { Application } from "@oak/oak";
import { router } from "./routes.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

async function init() {
    const app = new Application();

    app.use(oakCors({ origin: "*" }));
    app.use(router.routes());
    app.use(router.allowedMethods());

    const PORT = 5000;
    const HOST = Deno.env.get("NODE_ENV") !== "production"
        ? "localhost"
        : "0.0.0.0";

    console.log(
        `\x1b[1;34mServer berjalan pada \x1b[0;93mhttp://${HOST}:${PORT}\x1b[0m`,
    );
    await app.listen({ port: PORT, hostname: HOST });
}

if (import.meta.main) {
    await init();
}
