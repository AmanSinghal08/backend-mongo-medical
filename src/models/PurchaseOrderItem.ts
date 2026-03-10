import { Schema, model } from "mongoose";
import { IPurchaseOrderItem } from "./interfaces";

const purchaseOrderItemSchema = new Schema<IPurchaseOrderItem>(
  {

    purchaseOrderId: { type: Schema.Types.ObjectId, required: true, ref: "PurchaseOrder" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String, required: true, trim: true },
    batchNo: { type: String, trim: true },
    expiryDate: { type: Date },
    pack: { type: String, trim: true },
    hsn: { type: String, trim: true },
    qty: { type: Number, required: true, min: 1 },
    purchaseRate: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    sgst: { type: Number, required: true, default: 0, min: 0 },
    cgst: { type: Number, required: true, default: 0, min: 0 },
    lineAmount: { type: Number, required: true, default: 0, min: 0 },
  },
  {
    versionKey: false,
  },
);


const PurchaseOrderItem = model<IPurchaseOrderItem>("PurchaseOrderItem", purchaseOrderItemSchema, "purchase_order_items");

export default PurchaseOrderItem;
