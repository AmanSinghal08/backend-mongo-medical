import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IAdmin } from "./interfaces";

const adminSchema = new Schema<IAdmin>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    mobileNo: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    role: { type: String, required: true },
    token: { type: String },
    password: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

adminSchema.pre("save", async function (next) {
  const admin = this as any;

  if (!admin.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

adminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = model<IAdmin>("Admin", adminSchema, "admins");

export default Admin;