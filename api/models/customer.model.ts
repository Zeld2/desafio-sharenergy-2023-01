import mongoose from "mongoose";
import { ICustomer } from "../types/customer.interface";
import { model } from "mongoose";

const CustomersSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Field is required"] },
  email: { type: String, required: [true, "Field is required"] },
  telephone: { type: String, required: [true, "Field is required"] },
  cpf: { type: String, required: [true, "Field is required"] },
  adress: { type: String, required: [true, "Field is required"] },
});

export const Customer = model<ICustomer>("Customers", CustomersSchema);