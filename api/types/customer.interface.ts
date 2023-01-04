import { Document } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  email: string;
  telephone: string;
  cpf: string;
  adress: string;
}