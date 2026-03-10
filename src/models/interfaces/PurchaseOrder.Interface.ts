import { Types } from "mongoose";

export type PurchaseOrderPaymentStatus = "PENDING" | "PARTIAL" | "PAID" | "CANCELLED";

export interface IPurchaseOrder {
  _id: Types.ObjectId;
  purchaseOrderNumber: string;
  dealerId?: Types.ObjectId;
  orderDate: Date;
  dueDate?: Date;
  totalAmount: number;
  paymentStatus: PurchaseOrderPaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
