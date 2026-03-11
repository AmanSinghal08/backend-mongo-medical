import { Request, Response, NextFunction } from "express";
import * as UtilsHelper from "../helpers/utils.helper";
import getMessage from "../i18";

export default async function Auth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = (req as any).session;
    if (session?.adminId) {
      return next();
    }

    const _resData = UtilsHelper.responseObject();
    _resData.status = "error";
    _resData.statusCode = 401;
    _resData.msg = getMessage("401", "en") || "Unauthorized";
    _resData.msgCode = "401";
    _resData.data = null;

    return UtilsHelper.cRes(res, _resData);
  } catch (err: any) {
    const _resData = UtilsHelper.responseObject();
    _resData.status = "error";
    _resData.statusCode = 500;
    _resData.msg = err.message || "Internal Server Error";
    _resData.msgCode = "500";
    _resData.data = null;
    return UtilsHelper.cRes(res, _resData);
  }
}
