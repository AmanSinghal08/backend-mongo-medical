import * as express from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import { IResponseObject } from "../../../helpers/utils.interface";
import BaseController from "../../../helpers/BaseController";
import _ from "lodash";
import getMessage from "../../../i18";
import * as Model from "../../../models";
import mongoose from "mongoose";

class DealerPaymentController extends BaseController {
  constructor() {
    super();
    this.add = this.add.bind(this);
    this.list = this.list.bind(this);
  }

  public async add(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    const session = await mongoose.startSession();
    try {
      const {
        purchaseOrderId,
        dealerId,
        paymentDate,
        amount,
        paymentMode,
        comment,
      } = req.body;

      const [poExists, dealerExists] = await Promise.all([
        Model.PurchaseOrder.exists({ _id: purchaseOrderId }),
        Model.Dealer.exists({ _id: dealerId }),
      ]);

      if (!poExists || !dealerExists) {
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid purchase order or dealer selected.",
        });
        return this.sendResponse(res, _resData);
      }

      session.startTransaction();

      await Model.DealerPayment.create(
        [
          {
            purchaseOrderId,
            dealerId,
            paymentDate,
            amount,
            paymentMode,
            comment: comment || undefined,
          },
        ],
        { session },
      );

      await Model.Dealer.updateOne(
        { _id: dealerId },
        { $inc: { outstandingBalance: -amount } },
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
      this.logErrors(err, "Error in DealerPaymentController.add");
    }
    return this.sendResponse(res, _resData);
  }

  public async list(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const { purchaseOrderId, dealerId, paymentMode } = req.query as Record<
        string,
        string
      >;
      const match: any = {};

      if (purchaseOrderId) match.purchaseOrderId = purchaseOrderId;
      if (dealerId) match.dealerId = dealerId;
      if (paymentMode) match.paymentMode = paymentMode;

      const data = await Model.DealerPayment.aggregate([
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
            purchaseOrderNumber: "$purchase_order.purchaseOrderNumber",
            dealer_company_name: "$dealer.companyName",
            purchaseOrderId: 1,
            dealerId: 1,
            paymentDate: 1,
            amount: 1,
            paymentMode: 1,
            comment: 1,
            createdAt: 1,
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
      this.logErrors(err, "Error in DealerPaymentController.list");
    }
    return this.sendResponse(res, _resData);
  }
}

export default new DealerPaymentController();
