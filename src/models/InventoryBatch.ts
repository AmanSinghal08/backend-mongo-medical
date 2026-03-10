import { Schema, model } from "mongoose";
import { IInventoryBatch } from "./interfaces";

const inventoryBatchSchema = new Schema<IInventoryBatch>(
  {

    productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    dealerId: { type: Schema.Types.ObjectId, ref: "Dealer" },
    purchaseOrderId: { type: Schema.Types.ObjectId, ref: "PurchaseOrder" },
    batchNo: { type: String, required: true, trim: true },
    expiryDate: { type: Date },
    hsn: { type: String, required: true, trim: true },
    qty: { type: Number, required: true, default: 0, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    purchaseRate: { type: Number, required: true, min: 0 },
    sgst: { type: Number, required: true, default: 0, min: 0 },
    cgst: { type: Number, required: true, default: 0, min: 0 },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);

inventoryBatchSchema.index({ productId: 1 });
inventoryBatchSchema.index({ dealerId: 1 });
inventoryBatchSchema.index({ productId: 1, batchNo: 1 }, { unique: true });

const InventoryBatch = model<IInventoryBatch>("InventoryBatch", inventoryBatchSchema, "inventory_batches");

export default InventoryBatch;
