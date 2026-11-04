import { injectable } from "inversify";
import { Order } from "../domain/Order";
import { IOrderRepository } from "./IOrderRepository";

@injectable()
export class InMemoryOrderRepository implements IOrderRepository {
  private orders: Order[] = [];

  async save(order: Order): Promise<void> {
    this.orders.push(order);
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.find((o) => o.id === id) || null;
  }
}
