import { Schema, model } from "mongoose";
import { ISalesOrderItem } from "./interfaces";

const salesOrderItemSchema = new Schema<ISalesOrderItem>(
  {
    salesOrderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "SalesOrder",
    },
    inventoryBatchId: { type: Schema.Types.ObjectId, ref: "InventoryBatch" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    qty: { type: Number, required: true, min: 1 },
    rate: { type: Number, required: true, min: 0 },
    sgst: { type: Number, required: true, default: 0, min: 0 },
    cgst: { type: Number, required: true, default: 0, min: 0 },
    lineAmount: { type: Number, required: true, default: 0, min: 0 },
  },
  {
    timestamps: true,
  },
);

const SalesOrderItem = model<ISalesOrderItem>(
  "SalesOrderItem",
  salesOrderItemSchema,
  "sales_order_items",
);

export default SalesOrderItem;
