import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import getMessage from "../../../i18";

const Validators: any = {
  addValid: Joi.object({
    purchaseOrderId: Joi.string().required(),
    productId: Joi.string().optional().allow(null, ""),
    productName: Joi.string().required().trim(),
    batchNo: Joi.string().optional().allow(null, ""),
    expiryDate: Joi.string().optional().allow(null, ""),
    pack: Joi.string().optional().allow(null, ""),
    hsn: Joi.string().optional().allow(null, ""),
    qty: Joi.number().integer().min(1).required(),
    purchaseRate: Joi.number().min(0).required(),
    mrp: Joi.number().min(0).required(),
    sgst: Joi.number().min(0).optional(),
    cgst: Joi.number().min(0).optional(),
    lineAmount: Joi.number().min(0).optional(),
  }),
  editValid: Joi.object({
    purchaseOrderId: Joi.string().optional(),
    productId: Joi.string().optional().allow(null, ""),
    productName: Joi.string().trim().optional(),
    batchNo: Joi.string().optional().allow(null, ""),
    expiryDate: Joi.string().optional().allow(null, ""),
    pack: Joi.string().optional().allow(null, ""),
    hsn: Joi.string().optional().allow(null, ""),
    qty: Joi.number().integer().min(1).optional(),
    purchaseRate: Joi.number().min(0).optional(),
    mrp: Joi.number().min(0).optional(),
    sgst: Joi.number().min(0).optional(),
    cgst: Joi.number().min(0).optional(),
    lineAmount: Joi.number().min(0).optional(),
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
