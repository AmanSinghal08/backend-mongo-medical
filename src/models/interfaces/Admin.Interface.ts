import { Types } from "mongoose";


export interface IAdmin {
  _id: Types.ObjectId;
  firstName:string;
  lastName:string;
  mobileNo:string;
  email:string;
  isDeleted:Boolean;
  isActive:Boolean;
  role: string
  token: string;
  password: string
}
