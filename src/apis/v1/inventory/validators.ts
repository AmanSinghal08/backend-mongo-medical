import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";

import getMessage from "../../../i18";

const Validators: any = {
  addValid: Joi.object({
    productId: Joi.string().required(),
    dealerId: Joi.string().optional().allow(null, ""),
    purchaseOrderId: Joi.string().optional().allow(null, ""),
    batchNo: Joi.string().required().trim().uppercase(),
    expiryDate: Joi.string().optional().allow(null, ""),
    hsn: Joi.string().required().trim(),
    qty: Joi.number().integer().min(0).required(),
    mrp: Joi.number().min(0).required(),
    purchaseRate: Joi.number().min(0).required(),
    sgst: Joi.number().min(0).default(0),
    cgst: Joi.number().min(0).default(0),
    totalPurchaseAmount: Joi.number().min(0).default(0),
  }),

  editValid: Joi.object({
    productId: Joi.string().optional(),
    dealerId: Joi.string().optional().allow(null, ""),
    purchaseOrderId: Joi.string().optional().allow(null, ""),
    batchNo: Joi.string().trim().uppercase().optional(),
    expiryDate: Joi.string().trim().optional().allow(null, ""),
    hsn: Joi.string().trim().optional(),
    qty: Joi.number().integer().min(0).optional(),
    mrp: Joi.number().min(0).optional(),
    purchaseRate: Joi.number().min(0).optional(),
    sgst: Joi.number().min(0).optional(),
    cgst: Joi.number().min(0).optional(),
    totalPurchaseAmount: Joi.number().min(0).optional(),
  }),
};

export default function Validator(func: string) {
  return async function Validator(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validated = await Validators[func].validateAsync(req.body, {
        abortEarly: false,
      });
      req.body = validated;
      next();
    } catch (err: any) {
      const _er: any = {};
      if (err.isJoi) {
        err.details.forEach((d: any) => {
          const _key: string = d.context.key;
          _er[_key] = d.message;
        });
      }

      const _resData = UtilsHelper.responseObject();
      _resData.status = "error";
      _resData.statusCode = 400;
      _resData.msg = getMessage("511", "en");
      _resData.msgCode = "511";
      _resData.data = _er;

      return UtilsHelper.cRes(res, _resData);
    }
  };
}
