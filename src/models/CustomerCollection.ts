import { Schema, model } from "mongoose";
import { ICustomerCollection } from "./interfaces";

const paymentModes = ["Cash", "UPI", "Card", "Cheque"];

const customerCollectionSchema = new Schema<ICustomerCollection>(
  {

    salesOrderId: { type: Schema.Types.ObjectId, required: true, ref: "SalesOrder" },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
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

customerCollectionSchema.index({ salesOrderId: 1 });

const CustomerCollection = model<ICustomerCollection>("CustomerCollection", customerCollectionSchema, "customer_collections");

export default CustomerCollection;
