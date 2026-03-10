import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import getMessage from "../../../i18";

const Validators: any = {
  addValid: Joi.object({
    name: Joi.string().required().trim(),
    mobileNo: Joi.string().required().trim(),
    address: Joi.string().optional().allow(null, ""),
    city: Joi.string().optional().allow(null, ""),
    isActive: Joi.boolean().optional(),
    currentBalance: Joi.number().min(0).optional(),
  }),
  editValid: Joi.object({
    name: Joi.string().trim().optional(),
    mobileNo: Joi.string().trim().optional(),
    address: Joi.string().optional().allow(null, ""),
    city: Joi.string().optional().allow(null, ""),
    isActive: Joi.boolean().optional(),
    currentBalance: Joi.number().min(0).optional(),
  }),
};

export default function Validator(func: string) {
  return async function Validator(req: Request, res: Response, next: NextFunction) {
    try {
      req.body = await Validators[func].validateAsync(req.body, { abortEarly: false });
      next();
    } catch (err: any) {
      const errors: any = {};
      if (err.isJoi) {
        err.details.forEach((d: any) => {
          errors[d.context.key] = d.message;
        });
      }
      const data = UtilsHelper.responseObject();
      data.status = "error";
      data.statusCode = 400;
      data.msg = getMessage("511", "en");
      data.msgCode = "511";
      data.data = errors;
      return UtilsHelper.cRes(res, data);
    }
  };
}
