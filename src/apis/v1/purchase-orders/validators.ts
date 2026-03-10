import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import getMessage from "../../../i18";

const statusValues = ["PENDING", "PARTIAL", "PAID", "CANCELLED"];

const Validators: any = {
  addValid: Joi.object({
    purchaseOrderNumber: Joi.string().required().trim(),
    dealerId: Joi.string().optional().allow(null, ""),
    orderDate: Joi.string().required(),
    dueDate: Joi.string().optional().allow(null, ""),
    totalAmount: Joi.number().min(0).optional(),
    paymentStatus: Joi.string().valid(...statusValues).optional(),
    notes: Joi.string().optional().allow(null, ""),
  }),
  editValid: Joi.object({
    purchaseOrderNumber: Joi.string().trim().optional(),
    dealerId: Joi.string().optional().allow(null, ""),
    orderDate: Joi.string().optional(),
    dueDate: Joi.string().optional().allow(null, ""),
    totalAmount: Joi.number().min(0).optional(),
    paymentStatus: Joi.string().valid(...statusValues).optional(),
    notes: Joi.string().optional().allow(null, ""),
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
