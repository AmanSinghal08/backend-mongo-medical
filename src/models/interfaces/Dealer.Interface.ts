import { Types } from "mongoose";

export interface IDealer {
  _id: Types.ObjectId;
  contactName: string;
  companyName: string;
  mobileNo: string;
  address?: string;
  city?: string;
  isActive: boolean;
  outstandingBalance: number;
  createdAt: Date;
  updatedAt: Date;
}
