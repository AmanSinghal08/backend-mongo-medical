import * as express from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import { IResponseObject } from "../../../helpers/utils.interface";
import BaseController from "../../../helpers/BaseController";
import _ from "lodash";
import getMessage from "../../../i18";
import Customer from "../../../models/Customer";
import CustomerCollection from "../../../models/CustomerCollection";
import SalesOrder from "../../../models/SalesOrder";
import mongoose from "mongoose";
import * as Model from "../../../models";

class CustomerCollectionController extends BaseController {
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
    session.startTransaction();
    try {
      const {
        salesOrderId,
        customerId,
        paymentDate,
        amount,
        paymentMode,
        comment,
      } = req.body;

      const [salesOrderExists, customerExists] = await Promise.all([
        Model.SalesOrder.exists({ _id: salesOrderId }),
        Model.Customer.exists({ _id: customerId }),
      ]);

      if (!salesOrderExists || !customerExists) {
        await session.abortTransaction();
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid sales order or customer selected.",
        });
        return this.sendResponse(res, _resData);
      }

      await Model.CustomerCollection.create(
        [
          {
            salesOrderId: salesOrderId,
            customerId: customerId || undefined,
            paymentDate: paymentDate,
            amount,
            paymentMode: paymentMode,
            comment: comment || undefined,
          },
        ],
        { session },
      );

      await Model.Customer.updateOne(
        { _id: customerId },
        { $inc: { currentBalance: -amount } },
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
      this.logErrors(err, "Error in CustomerCollectionController.add");
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
      const { salesOrderId, customerId } = req.body;

      if (salesOrderId && !(await SalesOrder.exists({ _id: salesOrderId }))) {
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid sales order or customer selected.",
        });
        return this.sendResponse(res, _resData);
      }
      if (customerId && !(await Customer.exists({ _id: customerId }))) {
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid sales order or customer selected.",
        });
        return this.sendResponse(res, _resData);
      }

      await CustomerCollection.updateOne({ _id }, { $set: req.body });

      _.assign(_resData, {
        data: null,
        msgCode: "1007",
        msg: "Collection updated successfully",
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });
      this.logErrors(err, "Error in CustomerCollectionController.edit");
    }
    return this.sendResponse(res, _resData);
  }

  public async list(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const { salesOrderId, customerId, paymentMode } = req.query as Record<
        string,
        string
      >;
      const match: any = {};

      if (salesOrderId) match.customerId = salesOrderId;
      if (customerId) match.customerId = customerId;
      if (paymentMode) match.paymentMode = paymentMode;

      const data = await CustomerCollection.aggregate([
        { $match: match },
        {
          $lookup: {
            from: "sales_orders",
            localField: "salesOrderId",
            foreignField: "_id",
            as: "sales_order",
          },
        },
        { $unwind: { path: "$sales_order", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "customers",
            localField: "customerId",
            foreignField: "_id",
            as: "customer",
          },
        },
        { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            _id: 1,
            orderDate: "$sales_order.orderDate",
            customer_name: "$customer.name",
            salesOrderId: 1,
            customerId: 1,
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
      this.logErrors(err, "Error in CustomerCollectionController.list");
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
      await CustomerCollection.deleteOne({ _id });

      _.assign(_resData, {
        data: null,
        msgCode: "1010",
        msg: "Collection entry deleted",
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });
      this.logErrors(err, "Error in CustomerCollectionController.delete");
    }
    return this.sendResponse(res, _resData);
  }
}

export default new CustomerCollectionController();
