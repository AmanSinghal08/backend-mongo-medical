import express, { Application } from "express";
import compression from "compression";
import morgan from "morgan";
import helmet from "helmet";

export default class BaseApp {
    public app: Application;

    constructor() {
        this.app = express();
        this.setupStandardMiddleware();
    }

    /**
     * Standard middleware for security, performance, and logging
     */
    private setupStandardMiddleware() {
        // 1. Security Headers
        this.app.use(helmet());

        const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
        this.app.use(morgan(logFormat));
        
        // 2. Performance - Gzip compression
        this.app.use(compression());

        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    }
}