import * as express from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import { IResponseObject } from "../../../helpers/utils.interface";
import BaseController from "../../../helpers/BaseController";
import _ from "lodash";
import getMessage from "../../../i18";
import * as Model from "../../../models";
import { PipelineStage } from "mongoose";

class InventoryController extends BaseController {
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
      const { productId, dealerId, purchaseOrderId, batchNo } = req.body;

      const productExists = await Model.Product.exists({ _id: productId });
      if (!productExists) {
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid product/dealer/purchase order selected.",
        });
        return this.sendResponse(res, _resData);
      }
      if (dealerId && !(await Model.Dealer.exists({ _id: dealerId }))) {
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid product/dealer/purchase order selected.",
        });
        return this.sendResponse(res, _resData);
      }
      if (
        purchaseOrderId &&
        !(await Model.PurchaseOrder.exists({ _id: purchaseOrderId }))
      ) {
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid product/dealer/purchase order selected.",
        });
        return this.sendResponse(res, _resData);
      }

      await Model.InventoryBatch.create(req.body);

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

      this.logErrors(err, "Error in InventoryController.add");
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
      const { productId, dealerId, purchaseOrderId } = req.body;

      if (productId && !(await Model.Product.exists({ _id: productId }))) {
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid product/dealer/purchase order selected.",
        });
        return this.sendResponse(res, _resData);
      }
      if (dealerId && !(await Model.Dealer.exists({ _id: dealerId }))) {
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid product/dealer/purchase order selected.",
        });
        return this.sendResponse(res, _resData);
      }
      if (
        purchaseOrderId &&
        !(await Model.PurchaseOrder.exists({ _id: purchaseOrderId }))
      ) {
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid product/dealer/purchase order selected.",
        });
        return this.sendResponse(res, _resData);
      }
      console.log({ re: req.body });
      await Model.InventoryBatch.updateOne({ _id }, { $set: req.body });

      _.assign(_resData, {
        statusCode: 200,
        data: null,
        msgCode: "1007",
        msg: "Inventory batch updated successfully",
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });

      this.logErrors(err, "Error in InventoryController.edit");
    }

    return this.sendResponse(res, _resData);
  }

  public async list(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const customerId = req.query.customerId as string;
      const expiryDateQuery = req.query.expiryDate as string;
      let pipeline: PipelineStage[] = [];

      if (expiryDateQuery) {
        pipeline.push({
          $match: {
            expiryDate: { $lte: new Date(expiryDateQuery) },
          },
        });
      }
      pipeline.push(
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  product_type: 1,
                  criticalNumberAlert: 1,
                  pack: 1,
                },
              },
            ],
            as: "product",
          },
        },
        {
          $unwind: {
            path: "$product",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "dealers",
            localField: "dealerId",
            foreignField: "_id",
            pipeline: [{ $project: { companyName: 1 } }],
            as: "dealer",
          },
        },
        {
          $unwind: {
            path: "$dealer",
            preserveNullAndEmptyArrays: true,
          },
        },
      );

      if (customerId) {
        pipeline.push({
          $lookup: {
            from: "sales_order_items",
            localField: "productId",
            foreignField: "productId",
            pipeline: [
              {
                $match: {
                  customerId: UtilsHelper.ObjectId(customerId),
                },
              },
              {
                $sort: {
                  _id: -1,
                },
              },
              {
                $limit: 1,
              },
              {
                $project: {
                  _id: 0,
                  rate: "$rate",
                },
              },
            ],
            as: "lastSoldPrice",
          },
        });
        pipeline.push({
          $unwind: {
            path: "$lastSoldPrice",
            preserveNullAndEmptyArrays: true,
          },
        });
      }

      pipeline.push({
        $project: {
          _id: 1,
          productName: "$product.name",
          product_type: "$product.product_type",
          criticalNumberAlert: "$product.criticalNumberAlert",
          dealer_company_name: "$dealer.companyName",
          pack: "$product.pack",
          productId: 1,
          dealerId: 1,
          purchaseOrderId: 1,
          batchNo: 1,
          expiryDate: 1,
          hsn: 1,
          qty: 1,
          mrp: 1,
          purchaseRate: 1,
          sgst: 1,
          cgst: 1,
          createdAt: 1,
          updatedAt: 1,
          lastSoldPrice: "$lastSoldPrice.rate",
        },
      });

      const data = await Model.InventoryBatch.aggregate(pipeline);

      _.assign(_resData, {
        data: data,
        msgCode: "1005 1",
        msg: getMessage("1005", "en"),
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });

      this.logErrors(err, "Error in InventoryController.list");
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

      const deleted = await Model.InventoryBatch.deleteOne({ _id });

      _.assign(_resData, {
        data: null,
        msgCode: "1010",
        msg: "Inventory batch deleted",
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });

      this.logErrors(err, "Error in InventoryController.delete");
    }

    return this.sendResponse(res, _resData);
  }
}

const inventoryController = new InventoryController();

export default inventoryController;
