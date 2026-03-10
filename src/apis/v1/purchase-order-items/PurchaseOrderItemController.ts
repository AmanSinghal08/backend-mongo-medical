import * as express from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import { IResponseObject } from "../../../helpers/utils.interface";
import BaseController from "../../../helpers/BaseController";
import _ from "lodash";
import getMessage from "../../../i18";
import Product from "../../../models/Product";
import PurchaseOrder from "../../../models/PurchaseOrder";
import PurchaseOrderItem from "../../../models/PurchaseOrderItem";



class PurchaseOrderItemController extends BaseController {
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
      const {
        purchaseOrderId,
        productId,
        productName,
        batchNo,
        expiryDate,
        pack,
        hsn,
        qty,
        purchaseRate,
        mrp,
        sgst,
        cgst,
        lineAmount,
      } = req.body;

      if (
        !(await PurchaseOrder.exists({ _id: purchaseOrderId })) ||
        (productId && !(await Product.exists({ _id: productId })))
      ) {
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid purchase order or product selected.",
        });
        return this.sendResponse(res, _resData);
      }

      await PurchaseOrderItem.create({
        purchaseOrderId: purchaseOrderId,
        productId: productId || undefined,
        productName: productName,
        batchNo: batchNo || undefined,
        expiryDate: expiryDate || undefined,
        pack: pack || undefined,
        hsn: hsn || undefined,
        qty,
        purchaseRate: purchaseRate,
        mrp,
        sgst: sgst ?? 0,
        cgst: cgst ?? 0,
        lineAmount: lineAmount ?? 0,
      });

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
      this.logErrors(err, "Error in PurchaseOrderItemController.add");
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
      const {
        purchaseOrderId,
        productId,
        productName,
        batchNo,
        expiryDate,
        pack,
        hsn,
        qty,
        purchaseRate,
        mrp,
        sgst,
        cgst,
        lineAmount,
      } = req.body;

      if (
        purchaseOrderId &&
        !(await PurchaseOrder.exists({ _id: purchaseOrderId }))
      ) {
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid purchase order or product selected.",
        });
        return this.sendResponse(res, _resData);
      }
      if (productId && !(await Product.exists({ _id: productId }))) {
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid purchase order or product selected.",
        });
        return this.sendResponse(res, _resData);
      }

      const update: any = {};
      if (purchaseOrderId) update.purchaseOrderId = purchaseOrderId;
      if (productId) update.productId = productId;
      if (productName) update.productName = productName;
      if (batchNo) update.batchNo = batchNo;
      if (expiryDate) update.expiryDate = expiryDate;
      if (pack) update.pack = pack;
      if (hsn) update.hsn = hsn;
      if (qty !== undefined && qty !== null) update.qty = qty;
      if (purchaseRate !== undefined && purchaseRate !== null)
        update.purchaseRate = purchaseRate;
      if (mrp !== undefined && mrp !== null) update.mrp = mrp;
      if (sgst !== undefined && sgst !== null) update.sgst = sgst;
      if (cgst !== undefined && cgst !== null) update.cgst = cgst;
      if (lineAmount !== undefined && lineAmount !== null)
        update.lineAmount = lineAmount;

      await PurchaseOrderItem.updateOne(
        { _id },
        { $set: update },
      )

      _.assign(_resData, {
        data: null,
        msgCode: "1007",
        msg: "Purchase order item updated successfully",
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });
      this.logErrors(err, "Error in PurchaseOrderItemController.edit");
    }
    return this.sendResponse(res, _resData);
  }

  public async list(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const { purchaseOrderId, productId } = req.query as Record<
        string,
        string
      >;
      const match: any = {};

      if (purchaseOrderId) match.purchaseOrderId = purchaseOrderId;
      if (productId) match.productId = productId;

      const data = await PurchaseOrderItem.aggregate([
        { $match: match },
        {
          $lookup: {
            from: "purchase_orders",
            localField: "purchaseOrderId",
            foreignField: "_id",
            as: "purchase_order",
          },
        },
        {
          $unwind: {
            path: "$purchase_order",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
        { $sort: { _id: -1 } },
        {
          $project: {
            _id: 1,
            purchaseOrderNumber: "$purchase_order.purchaseOrderNumber",
            product_master_name: "$product.name",
            purchaseOrderId: 1,
            productId: 1,
            productName: 1,
            batchNo: 1,
            expiryDate: 1,
            pack: 1,
            hsn: 1,
            qty: 1,
            purchaseRate: 1,
            mrp: 1,
            sgst: 1,
            cgst: 1,
            lineAmount: 1,
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
      this.logErrors(err, "Error in PurchaseOrderItemController.list");
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
      await PurchaseOrderItem.deleteOne({_id}).lean();

      _.assign(_resData, {
        data: null,
        msgCode: "1010",
        msg: "Purchase order item deleted",
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });
      this.logErrors(err, "Error in PurchaseOrderItemController.delete");
    }
    return this.sendResponse(res, _resData);
  }
}

export default new PurchaseOrderItemController();
