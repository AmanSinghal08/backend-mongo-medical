import { Application, Request, Response, NextFunction,  } from "express";
import _ from "lodash";
import * as UtilsHelper from "../helpers/utils.helper";
import * as apisV1 from "./v1";
import getMessage from "../i18";

export function mount(app: Application): void {
	apisV1.mount(app);
	app.get("/", defaultRoute);
}

const defaultRoute = (req: Request, res: Response) => {
	let _resData = UtilsHelper.responseObject();

	_.assign(_resData, {
		msg: getMessage("1000", "en")
	});

	return UtilsHelper.cRes(res, _resData);
}