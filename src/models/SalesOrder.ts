import { Schema, model } from "mongoose";
import { ISalesOrder } from "./interfaces";

const paymentStatus = ["PENDING", "PARTIAL", "PAID", "CANCELLED"];

const salesOrderSchema = new Schema<ISalesOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, trim: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    orderDate: { type: Date, required: true },
    dueDate: { type: Date },
    taxableValue: { type: Number, required: true, default: 0, min: 0 },
    sgstTotal: { type: Number, required: true, default: 0, min: 0 },
    cgstTotal: { type: Number, required: true, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, default: 0, min: 0 },
    paymentStatus: { type: String, required: true, default: "PENDING", enum: paymentStatus },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
  },
);

salesOrderSchema.index({ customer_id: 1 });
salesOrderSchema.index({ due_date: 1 });

const SalesOrder = model<ISalesOrder>("SalesOrder", salesOrderSchema, "sales_orders");

export default SalesOrder;
