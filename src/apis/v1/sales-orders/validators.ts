import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import getMessage from "../../../i18";

const statusValues = ["PENDING", "PARTIAL", "PAID", "CANCELLED"];

const salesOrderItemSchema = Joi.object({
  inventoryBatchId: Joi.string().optional().allow(null, ""),
  productId: Joi.string().optional().allow(null, ""),
  customerId: Joi.string().required(),
  productName: Joi.string().required().trim(),
  batchNo: Joi.string().optional().allow(null, "").trim(),
  expiryDate: Joi.string().optional().allow(null, ""),
  pack: Joi.string().optional().allow(null, "").trim(),
  hsn: Joi.string().optional().allow(null, "").trim(),
  qty: Joi.number().min(1).required(),
  mrp: Joi.number().min(0).required(),
  rate: Joi.number().min(0).required(),
  sgst: Joi.number().min(0).optional(),
  cgst: Joi.number().min(0).optional(),
  lineAmount: Joi.number().min(0).optional(),
});

const orderDetailsSchema = Joi.object({
  orderNumber: Joi.string().required().trim(),
  customerId: Joi.string().optional().allow(null, ""),
  orderDate: Joi.string().required(),
  dueDate: Joi.string().optional().allow(null, ""),
  taxableValue: Joi.number().min(0).optional(),
  sgstTotal: Joi.number().min(0).optional(),
  cgstTotal: Joi.number().min(0).optional(),
  totalAmount: Joi.number().min(0).optional(),
  paymentStatus: Joi.string().valid(...statusValues).optional(),
  notes: Joi.string().optional().allow(null, ""),
});


const Validators: any = {
  
  addValid: Joi.object({
    orderDetails: orderDetailsSchema.required(),
    items: Joi.array().items(salesOrderItemSchema).min(1).optional(),
  }),

  editValid: Joi.object({
    orderNumber: Joi.string().trim().optional(),
    customerId: Joi.string().optional().allow(null, ""),
    orderDate: Joi.string().optional(),
    dueDate: Joi.string().optional().allow(null, ""),
    taxableValue: Joi.number().min(0).optional(),
    sgstTotal: Joi.number().min(0).optional(),
    cgstTotal: Joi.number().min(0).optional(),
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
