import server from "@/server/index.ts";
import { blue, brightYellow } from "@std/fmt/colors";

import "@std/dotenv/load";

async function init() {
    const port = Number(Deno.env.get("PORT"));
    const host = Deno.env.get("HOST")!;

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
    await init();
}
