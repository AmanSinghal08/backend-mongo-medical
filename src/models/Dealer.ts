import { Schema, model } from "mongoose";
import { IDealer } from "./interfaces";

const dealerSchema = new Schema<IDealer>(
  {

    contactName: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    mobileNo: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    isActive: { type: Boolean, required: true, default: true },
    outstandingBalance: { type: Number, required: true, default: 0, min: 0 },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);

const Dealer = model<IDealer>("Dealer", dealerSchema, "dealers");

export default Dealer;
