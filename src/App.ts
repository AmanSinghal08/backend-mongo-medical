import 'dotenv/config';
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import * as APIs from "./apis/index";
import BaseApp from "./middleware/BaseApp";
import cors from "cors";
import { connectDb } from './services/db';
 

class App extends BaseApp {
	constructor() {
		super();
 
		this.app.use(cors({}));
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
