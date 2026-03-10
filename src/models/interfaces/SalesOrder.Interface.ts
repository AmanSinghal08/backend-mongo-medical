import { Types } from "mongoose";

export type SalesOrderPaymentStatus = "PENDING" | "PARTIAL" | "PAID" | "CANCELLED";

export interface ISalesOrder {
  _id: Types.ObjectId;
  orderNumber: string;
  customerId?: Types.ObjectId;
  orderDate: Date;
  dueDate?: Date;
  taxableValue: number;
  sgstTotal: number;
  cgstTotal: number;
  totalAmount: number;
  paymentStatus: SalesOrderPaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
