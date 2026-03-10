import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import getMessage from "../../../i18";

const paymentModes = ["Cash", "UPI", "Card", "Cheque", "Bank Transfer"];

const Validators: any = {
  addValid: Joi.object({
    purchaseOrderId: Joi.string().required(),
    dealerId: Joi.string().optional().allow(null, ""),
    paymentDate: Joi.string().required(),
    amount: Joi.number().positive().required(),
    paymentMode: Joi.string().valid(...paymentModes).required(),
    comment: Joi.string().optional().allow(null, ""),
  }),
  editValid: Joi.object({
    purchaseOrderId: Joi.string().optional(),
    dealerId: Joi.string().optional().allow(null, ""),
    paymentDate: Joi.string().optional(),
    amount: Joi.number().positive().optional(),
    paymentMode: Joi.string().valid(...paymentModes).optional(),
    comment: Joi.string().optional().allow(null, ""),
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
