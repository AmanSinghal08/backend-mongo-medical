import * as express from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import { IResponseObject } from "../../../helpers/utils.interface";
import BaseController from "../../../helpers/BaseController";
import _ from "lodash";
import getMessage from "../../../i18";
import Dealer from "../../../models/Dealer";
import PurchaseOrder from "../../../models/PurchaseOrder";
import * as Model from "../../../models";
import mongoose from "mongoose";

class PurchaseOrderController extends BaseController {
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
    const session = await mongoose.startSession();
    try {
      const {
        purchaseOrderNumber,
        dealerId,
        orderDate,
        dueDate,
        totalAmount,
        paymentStatus,
        notes,
      } = req.body;

      const [dealerExists, duplicateOrder] = await Promise.all([
        Model.Dealer.exists({ _id: dealerId }),
        Model.PurchaseOrder.exists({
          purchaseOrderNumber: purchaseOrderNumber,
        }),
      ]);

      if (!dealerExists) {
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid dealer selected.",
        });
        return this.sendResponse(res, _resData);
      }

      if (duplicateOrder) {
        _.assign(_resData, {
          statusCode: 409,
          status: "error",
          msg: "Purchase order number already exists.",
        });
        return this.sendResponse(res, _resData);
      }

      session.startTransaction();

      await Model.PurchaseOrder.create(
        [
          {
            purchaseOrderNumber,
            dealerId,
            orderDate,
            dueDate: dueDate || undefined,
            totalAmount: totalAmount ?? 0,
            paymentStatus: paymentStatus || "PENDING",
            notes: notes || undefined,
          },
        ],
        { session },
      );

      await Model.Dealer.updateOne(
        { _id: dealerId },
        { $inc: { outstandingBalance: totalAmount ?? 0 } },
        { session },
      );

      await session.commitTransaction();

      _.assign(_resData, {
        data: null,
        msgCode: "1005",
        msg: getMessage("1005", "en"),
      });
    } catch (err: any) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });
      this.logErrors(err, "Error in PurchaseOrderController.add");
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
      const { purchaseOrderNumber, dealerId } = req.body;

      if (dealerId && !(await Dealer.exists({ _id: dealerId }))) {
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid dealer selected.",
        });
        return this.sendResponse(res, _resData);
      }

      if (purchaseOrderNumber) {
        const duplicate = await PurchaseOrder.exists({
          _id: { $ne: _id },
          purchaseOrderNumber: purchaseOrderNumber,
        });
        if (duplicate) {
          _.assign(_resData, {
            statusCode: 409,
            status: "error",
            msg: "Purchase order number already exists.",
          });
          return this.sendResponse(res, _resData);
        }
      }

      await PurchaseOrder.updateOne({ _id }, { $set: req.body });

      _.assign(_resData, {
        data: null,
        msgCode: "1007",
        msg: "Purchase order updated successfully",
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });
      this.logErrors(err, "Error in PurchaseOrderController.edit");
    }
    return this.sendResponse(res, _resData);
  }

  public async list(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const { purchaseOrderNumber, dealerId, paymentStatus } =
        req.query as Record<string, string>;
      const match: any = {};

      if (purchaseOrderNumber)
        match.purchaseOrderNumber = {
          $regex: purchaseOrderNumber,
          $options: "i",
        };
      if (dealerId) match.dealerId = dealerId;
      if (paymentStatus) match.paymentStatus = paymentStatus;

      const data = await PurchaseOrder.aggregate([
        { $match: match },
        {
          $lookup: {
            from: "dealers",
            localField: "dealerId",
            foreignField: "_id",
            as: "dealer",
          },
        },
        { $unwind: { path: "$dealer", preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            _id: 1,
            dealer_company_name: "$dealer.companyName",
            dealer_contact_name: "$dealer.contactName",
            purchaseOrderNumber: 1,
            dealerId: 1,
            orderDate: 1,
            dueDate: 1,
            totalAmount: 1,
            paymentStatus: 1,
            notes: 1,
            createdAt: 1,
            updatedAt: 1,
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
      this.logErrors(err, "Error in PurchaseOrderController.list");
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
      await PurchaseOrder.deleteOne({ _id });

      _.assign(_resData, {
        data: null,
        msgCode: "1010",
        msg: "Purchase order deleted",
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });
      this.logErrors(err, "Error in PurchaseOrderController.delete");
    }
    return this.sendResponse(res, _resData);
  }
}

export default new PurchaseOrderController();
