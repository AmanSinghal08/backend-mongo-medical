import 'dotenv/config';
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import * as APIs from "./apis/index";
import BaseApp from "./middleware/BaseApp";
import cors from "cors";
import session from "express-session";
import { connectDb } from './services/db';
 

class App extends BaseApp {
	constructor() {
		super();
 
		const isProd = process.env.NODE_ENV === "production";
		this.app.set("trust proxy", 1);

		this.app.use(
			cors({
				origin: process.env.ORIGIN,
				credentials: true,
			}),
		);

		this.app.use(
			session({
				name: process.env.SESSION_NAME,
				secret: process.env.SESSION_SECRET || "change-me",
				resave: false,
				saveUninitialized: false,
				cookie: {
					httpOnly: true,
					secure: isProd,
					sameSite: "lax",
					domain: process.env.DOMAIN,
					maxAge: 1000 * 60 * 60 * 24 * 7,
				},
			}),
		);
		APIs.mount(this.app);
		connectDb().catch((err) => {
			console.error('Failed to connect to DB:', err);
		});
		this.catchError();
	}

 
	/**
	 * Catch Errors
	 */
	private catchError() {

		// catch 404 and forward to error handler
		this.app.use((req: Request, res: Response, next: NextFunction) => {
			next(createHttpError(404));
		});

		// centralized error handler
		this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
			const status = err.status || 500;
			const isDev = req.app.get('env') === 'development';
			// Provide minimal error info in production
			res.status(status).json({
				status,
				message: err.message || 'Internal Server Error',
				...(isDev ? { stack: err.stack } : {}),
			});
		});
	}

 
}

export default new App().app;
