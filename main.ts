import { Application } from "@oak/oak";
import { router } from "./routes.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { blue, brightYellow } from "https://jsr.io/@std/fmt/1.0.9/colors.ts";
import { wideEventLogger } from "./logger.ts";

async function init() {
    const app = new Application();

    app.use(oakCors({ origin: "*" }));
    app.use(wideEventLogger);
    app.use(router.routes());
    app.use(router.allowedMethods());

    const PORT = 5000;
    const HOST = Deno.env.get("NODE_ENV") !== "production"
        ? "localhost"
        : "0.0.0.0";

    console.log(
        blue(`Server berjalan pada ${brightYellow(`http://${HOST}:${PORT}`)}`),
    );
    await app.listen({ port: PORT, hostname: HOST });
}

if (import.meta.main) {
    await init();
}
