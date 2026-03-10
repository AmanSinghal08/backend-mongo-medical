import { Schema, model } from "mongoose";
import { IDealerPayment } from "./interfaces";
import { createPrefixedId } from "./utils/prefixedId";

const paymentModes = ["Cash", "UPI", "Card", "Cheque", "Bank Transfer"];

const dealerPaymentSchema = new Schema<IDealerPayment>(
  {

    purchaseOrderId: { type: Schema.Types.ObjectId, required: true, ref: "PurchaseOrder" },
    dealerId: { type: Schema.Types.ObjectId, ref: "Dealer" },
    paymentDate: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0.01 },
    paymentMode: { type: String, required: true, enum: paymentModes },
    comment: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now, required: true },
  },
  {
    versionKey: false,
  },
);

dealerPaymentSchema.index({ purchaseOrderId: 1 });

const DealerPayment = model<IDealerPayment>("DealerPayment", dealerPaymentSchema, "dealer_payments");

export default DealerPayment;
