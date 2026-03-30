import { Schema, model } from "mongoose";
import { IProduct } from "./interfaces";

const productSchema = new Schema<IProduct>(
  {

    brandId: { type: Schema.Types.ObjectId, ref: "Brand" },
    name: { type: String, required: true, trim: true },
    product_type: { type: String, required: true, trim: true },
    hsn: { type: String, required: true, trim: true },
    pack: { type: String, required: true, trim: true },
    criticalNumberAlert: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  },
);

productSchema.index({ brandId: 1 });

const Product = model<IProduct>("Product", productSchema, "products");

export default Product;
