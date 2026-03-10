import { Types } from "mongoose";

export type CustomerCollectionPaymentMode = "Cash" | "UPI" | "Card" | "Cheque";

export interface ICustomerCollection {
  _id: Types.ObjectId;
  salesOrderId: Types.ObjectId;
  customerId?: Types.ObjectId;
  paymentDate: Date;
  amount: number;
  paymentMode: CustomerCollectionPaymentMode;
  comment?: string;
  createdAt: Date;
}
