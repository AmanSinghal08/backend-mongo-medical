import { Schema, model } from "mongoose";
import { IBrand } from "./interfaces";
 

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
  },
  {
    timestamps: true,
  },
);

const Brand = model<IBrand>("Brand", brandSchema, "brands");

export default Brand;
