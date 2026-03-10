import { Types } from "mongoose";

export interface IProduct {
  _id: Types.ObjectId;
  brandId?: Types.ObjectId;
  name: string;
  product_type: string;
  hsn: string;
  pack: string;
  criticalNumberAlert: number;
  createdAt: Date;
  updatedAt: Date;
}
