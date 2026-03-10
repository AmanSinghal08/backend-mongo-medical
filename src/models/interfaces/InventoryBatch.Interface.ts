import { Types } from "mongoose";

export interface IInventoryBatch {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  dealerId?: Types.ObjectId;
  purchaseOrderId?: Types.ObjectId;
  batchNo: string;
  expiryDate?: Date;
  hsn: string;
  qty: number;
  mrp: number;
  purchaseRate: number;
  sgst: number;
  cgst: number;
  createdAt: Date;
  updatedAt: Date;
}
