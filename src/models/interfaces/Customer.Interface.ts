import { Types } from "mongoose";

export interface ICustomer {
  _id: Types.ObjectId;
  name: string;
  mobileNo: string;
  licenseNo: string;
  address?: string;
  city?: string;
  isActive: boolean;
  currentBalance: number;
  createdAt: Date;
  updatedAt: Date;
}
