import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";

import getMessage from "../../../i18";

const Validators: any = {
  addValid: Joi.object({
    name: Joi.string().required().trim().messages({
      "string.empty": "Product name cannot be empty",
    }),
    brandId: Joi.string().optional().allow(null, ""),
    product_type: Joi.string().required().trim().lowercase(),
    hsn: Joi.string().required().trim(),
    pack: Joi.string().required().trim(),
    criticalNumberAlert: Joi.number().required()
  }),

  editValid: Joi.object({
    name: Joi.string().trim().optional(),
    brandId: Joi.string().optional().allow(null, ""),
    product_type: Joi.string().trim().lowercase().optional(),
    hsn: Joi.string().trim().optional(),
    pack: Joi.string().trim().optional(),
    criticalNumberAlert: Joi.number().required()
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
