import * as express from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import { IResponseObject } from "../../../helpers/utils.interface";
import BaseController from "../../../helpers/BaseController";
import _ from "lodash";
import getMessage from "../../../i18";
import InventoryBatch from "../../../models/InventoryBatch";
import Product from "../../../models/Product";
import SalesOrder from "../../../models/SalesOrder";
import SalesOrderItem from "../../../models/SalesOrderItem";
import * as Model from "../../../models";

class SalesOrderItemController extends BaseController {
  constructor() {
    super();
    // this.add = this.add.bind(this);
    // this.edit = this.edit.bind(this);
    this.list = this.list.bind(this);
    // this.delete = this.delete.bind(this);
    this.lastSold = this.lastSold.bind(this);
  }

  // public async add(
  //   req: express.Request,
  //   res: express.Response,
  // ): Promise<void | any> {
  //   const _resData: IResponseObject = UtilsHelper.responseObject();
  //   try {
  //     const { salesOrderId, inventoryBatchId, productId } = req.body;

  //     if (!(await SalesOrder.exists({ _id: salesOrderId }))) {
  //       _.assign(_resData, {
  //         statusCode: 400,
  //         status: "error",
  //         msg: "Invalid sales order/product/batch selected.",
  //       });
  //       return this.sendResponse(res, _resData);
  //     }
  //     if (productId && !(await Product.exists({ _id: productId }))) {
  //       _.assign(_resData, {
  //         statusCode: 400,
  //         status: "error",
  //         msg: "Invalid sales order/product/batch selected.",
  //       });
  //       return this.sendResponse(res, _resData);
  //     }
  //     if (
  //       inventoryBatchId &&
  //       !(await InventoryBatch.exists({ _id: inventoryBatchId }))
  //     ) {
  //       _.assign(_resData, {
  //         statusCode: 400,
  //         status: "error",
  //         msg: "Invalid sales order/product/batch selected.",
  //       });
  //       return this.sendResponse(res, _resData);
  //     }

  //     await SalesOrderItem.create(req.body);

  //     _.assign(_resData, {
  //       data: null,
  //       msgCode: "1005",
  //       msg: getMessage("1005", "en"),
  //     });
  //   } catch (err: any) {
  //     _.assign(_resData, {
  //       statusCode: 500,
  //       status: "error",
  //       msg: err.message,
  //     });
  //     this.logErrors(err, "Error in SalesOrderItemController.add");
  //   }
  //   return this.sendResponse(res, _resData);
  // }

  // public async edit(
  //   req: express.Request,
  //   res: express.Response,
  // ): Promise<void | any> {
  //   const _resData: IResponseObject = UtilsHelper.responseObject();
  //   try {
  //     const { id: _id } = req.params;
  //     const { salesOrderId, inventoryBatchId, productId } = req.body;

  //     if (salesOrderId && !(await SalesOrder.exists({ _id: salesOrderId }))) {
  //       _.assign(_resData, {
  //         statusCode: 400,
  //         status: "error",
  //         msg: "Invalid sales order/product/batch selected.",
  //       });
  //       return this.sendResponse(res, _resData);
  //     }
  //     if (productId && !(await Product.exists({ _id: productId }))) {
  //       _.assign(_resData, {
  //         statusCode: 400,
  //         status: "error",
  //         msg: "Invalid sales order/product/batch selected.",
  //       });
  //       return this.sendResponse(res, _resData);
  //     }
  //     if (
  //       inventoryBatchId &&
  //       !(await InventoryBatch.exists({ _id: inventoryBatchId }))
  //     ) {
  //       _.assign(_resData, {
  //         statusCode: 400,
  //         status: "error",
  //         msg: "Invalid sales order/product/batch selected.",
  //       });
  //       return this.sendResponse(res, _resData);
  //     }

  //     const updated = await SalesOrderItem.updateOne(
  //       { _id },
  //       { $set: req.body },
  //     );

  //     _.assign(_resData, {
  //       data: null,
  //       msgCode: "1007",
  //       msg: "Sales order item updated successfully",
  //     });
  //   } catch (err: any) {
  //     _.assign(_resData, {
  //       statusCode: 500,
  //       status: "error",
  //       msg: err.message,
  //     });
  //     this.logErrors(err, "Error in SalesOrderItemController.edit");
  //   }
  //   return this.sendResponse(res, _resData);
  // }

  public async list(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const { salesOrderId, productId } = req.query as Record<string, string>;
      const match: any = {};

      if (salesOrderId) match.salesOrderId = salesOrderId;
      if (productId) match.productId = productId;

      const data = await SalesOrderItem.aggregate([
        { $match: match },
        {
          $lookup: {
            from: "sales_orders",
            localField: "salesOrderId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  orderDate: "$orderDate",
                },
              },
            ],
            as: "sales_order",
          },
        },
        {
          $unwind: {
            path: "$sales_order",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "inventory_batches",
            localField: "inventoryBatchId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  batchNo: "$batchNo",
                  expiryDate: "$expiryDate",
                  mrp: "$mrp",
                  hsn: "$hsn",
                },
              },
            ],
            as: "inventory_batches",
          },
        },
        {
          $unwind: {
            path: "$inventory_batches",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  pack: "$pack"
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
        { $sort: { _id: -1 } },
        {
          $project: {
            _id: 1,
            orderDate: "$sales_order.orderDate",
            product_master_name: "$product.name",
            salesOrderId: 1,
            inventoryBatchId: 1,
            productId: 1,
            productName: 1,
            pack:  "$product.pack",
            qty: 1,
            rate: 1,
            sgst: 1,
            cgst: 1,
            lineAmount: 1,
            batchNo: "$inventory_batches.batchNo",
            expiryDate: "$inventory_batches.expiryDate",
            mrp: "$inventory_batches.mrp",
            hsn: "$inventory_batches.hsn",
          },
        },
      ]);

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
      this.logErrors(err, "Error in SalesOrderItemController.list");
    }
    return this.sendResponse(res, _resData);
  }

  // public async delete(
  //   req: express.Request,
  //   res: express.Response,
  // ): Promise<void | any> {
  //   const _resData: IResponseObject = UtilsHelper.responseObject();
  //   try {
  //     const { id: _id } = req.params;
  //     await SalesOrderItem.updateOne({ _id });

  //     _.assign(_resData, {
  //       data: null,
  //       msgCode: "1010",
  //       msg: "Sales order item deleted",
  //     });
  //   } catch (err: any) {
  //     _.assign(_resData, {
  //       statusCode: 500,
  //       status: "error",
  //       msg: err.message,
  //     });
  //     this.logErrors(err, "Error in SalesOrderItemController.delete");
  //   }
  //   return this.sendResponse(res, _resData);
  // }

  public async lastSold(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const { productId, customerId } = req.params;

      _.assign(_resData, {
        data: await Model.SalesOrderItem.findOne({
          productId,
          customerId,
        }).lean(),
        msgCode: "1010",
        msg: "Last Sold product",
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });
      this.logErrors(err, "Error in SalesOrderItemController.lastSold");
    }
    return this.sendResponse(res, _resData);
  }
}

export default new SalesOrderItemController();
