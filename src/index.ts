import { logger } from "./application/logging";
import { web } from "./application/web";
import "dotenv/config";

const port: number = process.env.PORT != null ? parseInt(process.env.PORT) : 3000;

web.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
    logger.info(`Listening on http://localhost:${port}`);
});
