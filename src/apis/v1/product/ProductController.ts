import * as express from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import { IResponseObject } from "../../../helpers/utils.interface";
import BaseController from "../../../helpers/BaseController";
import _ from "lodash";
import getMessage from "../../../i18";
import Brand from "../../../models/Brand";
import { PipelineStage } from "mongoose";
import * as Model from "../../../models";



class ProductController extends BaseController {
  constructor() {
    super();

    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);
    this.list = this.list.bind(this);
    this.delete = this.delete.bind(this);
  }

  public async add(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const { brandId } = req.body;

      if (brandId) {
        const brandExists = await Model.Brand.exists({ _id: brandId });
        if (!brandExists) {
          _.assign(_resData, {
            statusCode: 400,
            status: "error",
            msg: "Invalid brand selected.",
          });
          return this.sendResponse(res, _resData);
        }
      }

      await Model.Product.create(req.body);

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

      this.logErrors(err, "Error in ProductController.add");
    }

    return this.sendResponse(res, _resData);
  }

  public async edit(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();

    try {
      const { id: _id } = req.params;
      const { brandId } = req.body;

      if (brandId) {
        const brandExists = await Model.Brand.exists({ _id: brandId });
        if (!brandExists) {
          _.assign(_resData, {
            statusCode: 400,
            status: "error",
            msg: "Invalid brand selected.",
          });
          return this.sendResponse(res, _resData);
        }
      }

      await Model.Product.updateOne(
        { _id },
        { $set: req.body },
      );

      _.assign(_resData, {
        statusCode: 200,
        data: null,
        msgCode: "1007",
        msg: "Product updated successfully",
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });
      this.logErrors(err, "Error in ProductController.edit");
    }

    return this.sendResponse(res, _resData);
  }

  public async list(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const pipeline: PipelineStage[] = [
        {
          $sort: {
            name: 1,
          },
        },
        {
          $lookup: {
            from: "brands",
            localField: "brandId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1, companyName: 1 } }],
            as: "brand",
          },
        },
        {
          $unwind: {
            path: "$brand",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            brand_name: "$brand.name",
            companyName: "$brand.companyName",
            brandId: 1,
            name: 1,
            product_type: 1,
            hsn: 1,
            pack: 1,
            createdAt: 1,
            updatedAt: 1,
            criticalNumberAlert: "$criticalNumberAlert"
          },
        },
      ];

      const data = await Model.Product.aggregate(pipeline);

      _.assign(_resData, {
        data: data,
        msgCode: "1005",
        msg: getMessage("1005", "en"),
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });

      this.logErrors(err, "Error in ProductController.list");
    }

    return this.sendResponse(res, _resData);
  }

  public async delete(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const { id: _id } = req.params;

      await Model.Product.deleteOne({ _id })

      _.assign(_resData, {
        data: null,
        msgCode: "1010",
        msg: "Product deleted",
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });

      this.logErrors(err, "Error in ProductController.delete");
    }

    return this.sendResponse(res, _resData);
  }
}

const productController = new ProductController();

export default productController;
