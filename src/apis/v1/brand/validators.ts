import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import _ from "lodash";

import getMessage from "../../../i18";

const Validators: any = {
  addValid: Joi.object({
    name: Joi.string().required().trim().messages({
      "string.empty": "Brand name is required",
    }),
    companyName: Joi.string().required().trim().messages({
      "string.empty": "Company name is required",
    }),
  }),

  editValid: Joi.object({
    name: Joi.string().trim().optional(),
    companyName: Joi.string().trim().optional(),
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
      let _er: any = {};
      if (err.isJoi) {
        err.details.forEach((d: any) => {
          let _key: string = d.context.key;
          _er[_key] = d.message;
        });
      }

      let _resData = UtilsHelper.responseObject();
      _resData.status = "error";
      _resData.statusCode = 400;
      _resData.msg = getMessage("511", "en");
      _resData.msgCode = "511";
      _resData.data = _er;

      return UtilsHelper.cRes(res, _resData);
    }
  };
}
