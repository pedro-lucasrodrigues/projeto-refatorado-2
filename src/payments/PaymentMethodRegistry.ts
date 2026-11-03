import { IPaymentMethod } from './IPaymentMethod';

export class PaymentMethodRegistry {
  constructor(private methods: IPaymentMethod[]) {}

  get(name: string): IPaymentMethod | undefined {
    return this.methods.find((method) => method.name === name);
  }
}
