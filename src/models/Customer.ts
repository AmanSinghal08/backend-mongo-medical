import { Schema, model } from "mongoose";
import { ICustomer } from "./interfaces";

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    mobileNo: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    isActive: { type: Boolean, required: true, default: true },
    currentBalance: { type: Number, required: true, default: 0, min: 0 },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);

const Customer = model<ICustomer>("Customer", customerSchema, "customers");

export default Customer;
