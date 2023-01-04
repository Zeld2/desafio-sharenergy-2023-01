import { Customer } from "../models/customer.model";
import { ICustomer } from "../types/customer.interface";

export class CustomersService {
    public findAll(): Promise<ICustomer[]> {
        return Customer.find({}).exec();
    }

    public add(Customers: ICustomer): Promise<ICustomer> {
        const newCustomers = new Customer(Customers)
        return newCustomers.save()
    }

    public async delete(id: string) {
        const deletedCustomers = await Customer.findByIdAndDelete(
            id
        ).exec();

        if (!deletedCustomers) {
            throw new Error(`Pokemon with id '${id}' not found`);
        }
        return deletedCustomers;
    }

    public async update(id: string, Customers: ICustomer) {
        const updatedCustomers = await Customer.findByIdAndUpdate(
            id,
            Customers
        ).exec();

        if (!updatedCustomers) {
            throw new Error(`Customers with id '${id}' not found`);
        }

        return Customer.findById(id);
    }
}