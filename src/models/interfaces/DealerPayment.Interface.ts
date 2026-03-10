import { Types } from "mongoose";

export type DealerPaymentMode = "Cash" | "UPI" | "Card" | "Cheque" | "Bank Transfer";

export interface IDealerPayment {
  _id: Types.ObjectId;
  purchaseOrderId: Types.ObjectId;
  dealerId?: Types.ObjectId;
  paymentDate: Date;
  amount: number;
  paymentMode: DealerPaymentMode;
  comment?: string;
  createdAt: Date;
}
