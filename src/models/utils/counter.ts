import { Schema, model } from "mongoose";

interface ICounter {
  _id: string;
  seq: number;
}

const counterSchema = new Schema<ICounter>(
  {
    _id: { type: String, required: true },
    seq: { type: Number, required: true, default: 0 },
  },
  {
    versionKey: false,
  },
);

const Counter = model<ICounter>("Counter", counterSchema, "counters");
