import { Types } from "mongoose";

export interface ISalesOrderItem {
  _id: Types.ObjectId;
  salesOrderId: Types.ObjectId;
  inventoryBatchId?: Types.ObjectId;
  productId?: Types.ObjectId;
  customerId: Types.ObjectId;
  qty: number;
  rate: number;
  sgst: number;
  cgst: number;
  lineAmount: number;
}
