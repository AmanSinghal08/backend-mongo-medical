import app from "./App";
import * as http from "http";
const port = Number(process.env.PORT);
const server = http.createServer(app);

server.listen(port, () => {
    console.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});

// Graceful Shutdown
async function gracefulShutdown(signal: string) {
    console.info(`\n${signal} received. Starting graceful shutdown...`);
    server.close(async () => {
        process.exit(0);
    });

    setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));