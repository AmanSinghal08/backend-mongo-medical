import { Schema, model } from "mongoose";
import { IPurchaseOrder } from "./interfaces";
import { createPrefixedId } from "./utils/prefixedId";

const paymentStatus = ["PENDING", "PARTIAL", "PAID", "CANCELLED"];

const purchaseOrderSchema = new Schema<IPurchaseOrder>(
  {

    purchaseOrderNumber: { type: String, required: true, unique: true, trim: true },
    dealerId: { type: Schema.Types.ObjectId, ref: "Dealer" },
    orderDate: { type: Date, required: true },
    dueDate: { type: Date },
    totalAmount: { type: Number, required: true, default: 0, min: 0 },
    paymentStatus: { type: String, required: true, default: "PENDING", enum: paymentStatus },
    notes: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);

purchaseOrderSchema.index({ dealerId: 1 });
purchaseOrderSchema.index({ dueDate: 1 });

const PurchaseOrder = model<IPurchaseOrder>("PurchaseOrder", purchaseOrderSchema, "purchase_orders");

export default PurchaseOrder;
