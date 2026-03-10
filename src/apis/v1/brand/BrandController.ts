import * as express from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import { IResponseObject } from "../../../helpers/utils.interface";
import BaseController from "../../../helpers/BaseController";
import _ from "lodash";
import getMessage from "../../../i18";
import * as Model from "../../../models";

class BrandController extends BaseController {
  constructor() {
    super();

    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);
    this.list = this.list.bind(this);
    this.delete = this.delete.bind(this);
  }

  public async add(req: express.Request, res: express.Response): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const { name, companyName } = req.body;
      await Model.Brand.create({ name, companyName: companyName || undefined });

      _.assign(_resData, {
        data: null,
        msgCode: "1005",
        msg: getMessage("1005", "en"),
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });

      this.logErrors(err, "Error in BrandController.add");
    }

    return this.sendResponse(res, _resData);
  }

  public async edit(req: express.Request, res: express.Response): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const { id: _id } = req.params;

      await Model.Brand.updateOne({ _id }, { $set: req.body })

      _.assign(_resData, {
        statusCode: 200,
        data: null,
        msgCode: "1007",
        msg: getMessage("1007", "en"),
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });

      this.logErrors(err, "Error in BrandController.edit");
    }

    return this.sendResponse(res, _resData);
  }

  public async list(req: express.Request, res: express.Response): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const data = await Model.Brand.find({}).lean();
      _.assign(_resData, {
        data,
        msgCode: "1005",
        msg: getMessage("1005", "en"),
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });

      this.logErrors(err, "Error in BrandController.list");
    }

    return this.sendResponse(res, _resData);
  }

  public async delete(req: express.Request, res: express.Response): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const { id: _id } = req.params;
      await Model.Brand.deleteOne({ _id })

      _.assign(_resData, {
        data: null,
        msgCode: "1010",
        msg: getMessage("1010", "en"),
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });

      this.logErrors(err, "Error in BrandController.delete");
    }

    return this.sendResponse(res, _resData);
  }
}

const brandController = new BrandController();

export default brandController;
