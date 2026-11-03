import express from 'express';
import { PrismaClient } from '@prisma/client';
import { OrderController } from './controllers/OrderController';
import { OrderService } from './services/OrderService';
import { NotificationService } from './services/NotificationService';
import { PrismaProductRepository } from './repositories/PrismaProductRepository';
import { PrismaOrderRepository } from './repositories/PrismaOrderRepository';
import { EtherealMailProvider } from './providers/EtherealMailProvider';
import { PaymentMethodRegistry } from './payments/PaymentMethodRegistry';
import { CreditCardPayment } from './payments/CreditCardPayment';
import { DebitCardPayment } from './payments/DebitCardPayment';
import { PixPayment } from './payments/PixPayment';

const prisma = new PrismaClient();

const orderService = new OrderService(
  new PrismaProductRepository(prisma),
  new PrismaOrderRepository(prisma),
  new PaymentMethodRegistry([new CreditCardPayment(), new DebitCardPayment(), new PixPayment()]),
  new NotificationService(new EtherealMailProvider()),
);
const orderController = new OrderController(orderService);

const app = express();
app.use(express.json());

app.post('/orders', orderController.processOrder);

export default app;
