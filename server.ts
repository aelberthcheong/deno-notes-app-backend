import express from "express";
import { routes } from "./routes.ts";
import { blue, brightYellow } from "@std/fmt/colors";

function init() {
    const app = express();
    const port = 3000;
    const host = Deno.env.get("NODE_ENV") !== "production"
        ? "localhost"
        : "0.0.0.0";

    app.use(express.json());
    app.use("/", routes);

    app.listen(port, host, () => {
        console.log(
            blue(
                `Server berjalan pada ${
                    brightYellow(`http://${host}:${port}`)
                }`,
            ),
        );
    });
}

if (import.meta.main) {
    init();
}
