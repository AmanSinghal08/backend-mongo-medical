import { Types } from "mongoose";

export interface IPurchaseOrderItem {
  _id: Types.ObjectId;
  purchaseOrderId: Types.ObjectId;
  productId?: Types.ObjectId;
  productName: string;
  batchNo?: string;
  expiryDate?: Date;
  pack?: string;
  hsn?: string;
  qty: number;
  purchaseRate: number;
  mrp: number;
  sgst: number;
  cgst: number;
  lineAmount: number;
}
