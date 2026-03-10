import { Types } from "mongoose";

export interface IBrand {
  _id: Types.ObjectId;
  name: string;
  companyName?: string;
  createdAt: Date;
  updatedAt: Date;
}
