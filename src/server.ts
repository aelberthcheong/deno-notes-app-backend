import server from "./server/index.ts";
import { blue, brightYellow } from "@std/fmt/colors";

function init() {
    const port = 3000;
    const host = Deno.env.get("NODE_ENV") !== "production"
        ? "localhost"
        : "0.0.0.0";

    server.listen(port, host, () => {
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
