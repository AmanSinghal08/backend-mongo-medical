import * as express from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import { IResponseObject } from "../../../helpers/utils.interface";
import BaseController from "../../../helpers/BaseController";
import _ from "lodash";
import getMessage from "../../../i18";
import Customer from "../../../models/Customer";
import SalesOrder from "../../../models/SalesOrder";
import * as Model from "../../../models";
import mongoose from "mongoose";

class SalesOrderController extends BaseController {
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
      const { orderDetails, items } = req.body;

      const [customerExists, duplicateOrder] = await Promise.all([
        Customer.exists({ _id: orderDetails.customerId }),
        SalesOrder.exists({ orderNumber: orderDetails.orderNumber }),
      ]);

      if (!customerExists) {
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid customer selected.",
        });
        return this.sendResponse(res, _resData);
      }
      if (duplicateOrder) {
        _.assign(_resData, {
          statusCode: 409,
          status: "error",
          msg: "Order number already exists.",
        });
        return this.sendResponse(res, _resData);
      }
      let totalOrderAmount = 0;
      const inventoryUpdates = [];
      const salesOrderItems = [];

      const [newOrder] = await Model.SalesOrder.create([orderDetails], {
        session,
      });

      for (const item of items) {
        totalOrderAmount += item.lineAmount;

        inventoryUpdates.push({
          updateOne: {
            filter: { _id: item.inventoryBatchId, qty: { $gte: item.qty } },
            update: { $inc: { qty: -item.qty } },
          },
        });

        salesOrderItems.push({
          salesOrderId: newOrder._id,
          ...item,
        });
      }

      const result = await Model.InventoryBatch.bulkWrite(inventoryUpdates, {
        session,
      });

      if (result.matchedCount !== items.length) {
        throw new Error("Insufficient stock in one or more batches.");
      }

      await Model.SalesOrderItem.insertMany(salesOrderItems, { session });

      await Model.Customer.updateOne(
        { _id: orderDetails.customerId },
        { $inc: { currentBalance: totalOrderAmount } },
        { session },
      );

      await session.commitTransaction();

      _.assign(_resData, {
        data: null,
        msgCode: "1013",
        msg: getMessage("1013", "en"),
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
      this.logErrors(err, "Error in SalesOrderController.add");
    }
    return this.sendResponse(res, _resData);
  }

  public async edit(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const { _id } = req.params;
      const { orderNumber, customerId } = req.body;

      if (customerId && !(await Customer.exists({ _id: customerId }))) {
        _.assign(_resData, {
          statusCode: 400,
          status: "error",
          msg: "Invalid customer selected.",
        });
        return this.sendResponse(res, _resData);
      }

      if (orderNumber) {
        const duplicate = await SalesOrder.exists({
          _id: { $ne: _id },
          orderNumber,
        });
        if (duplicate) {
          _.assign(_resData, {
            statusCode: 409,
            status: "error",
            msg: "Order number already exists.",
          });
          return this.sendResponse(res, _resData);
        }
      }

      await SalesOrder.updateOne({ _id }, { $set: req.body });

      _.assign(_resData, {
        data: null,
        msgCode: "1007",
        msg: "Sales order updated successfully",
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });
      this.logErrors(err, "Error in SalesOrderController.edit");
    }
    return this.sendResponse(res, _resData);
  }

  public async list(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const { orderNumber, customerId, paymentStatus } = req.query as Record<
        string,
        string
      >;
      const match: any = {};

      if (orderNumber) {
        match.orderNumber = { $regex: orderNumber, $options: "i" };
      }

      if (customerId) {
        match.customerId = customerId;
      }
      if (paymentStatus) {
        match.paymentStatus = paymentStatus;
      }

      const data = await SalesOrder.aggregate([
        { $match: match },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "customers",
            localField: "customerId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  mobileNo: 1,
                },
              },
            ],
            as: "customer",
          },
        },
        {
          $unwind: {
            path: "$customer",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            customer_name: "$customer.name",
            customer_mobile: "$customer.mobileNo",
            orderDate: 1,
            customerId: 1,
            dueDate: 1,
            taxableValue: 1,
            sgstTotal: 1,
            cgstTotal: 1,
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
      this.logErrors(err, "Error in SalesOrderController.list");
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

      await SalesOrder.deleteOne({ _id });

      _.assign(_resData, {
        data: null,
        msgCode: "1010",
        msg: "Sales order deleted",
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });
      this.logErrors(err, "Error in SalesOrderController.delete");
    }
    return this.sendResponse(res, _resData);
  }
}

export default new SalesOrderController();
