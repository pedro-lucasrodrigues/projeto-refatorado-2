import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from './types';

import { OrderController } from '../controllers/OrderController';
import { OrderService } from '../services/OrderService';
import { NotificationService } from '../services/NotificationService';

import { IMailProvider } from '../providers/IMailProvider';
import { EtherealMailProvider } from '../providers/EtherealMailProvider';
import { ConsoleMailProvider } from '../providers/ConsoleMailProvider';

import { IOrderRepository } from '../repositories/IOrderRepository';
import { IProductRepository } from '../repositories/IProductRepository';
import { PrismaOrderRepository } from '../repositories/PrismaOrderRepository';
import { PrismaProductRepository } from '../repositories/PrismaProductRepository';
import { InMemoryOrderRepository } from '../repositories/InMemoryOrderRepository';

import { IPaymentMethod } from '../payments/IPaymentMethod';
import { PaymentMethodRegistry } from '../payments/PaymentMethodRegistry';
import { CreditCardPayment } from '../payments/CreditCardPayment';
import { DebitCardPayment } from '../payments/DebitCardPayment';
import { PixPayment } from '../payments/PixPayment';

type AppEnv = 'dev' | 'test';

function resolveAppEnv(): AppEnv {
  const value = process.env.APP_ENV ?? 'dev';
  if (value !== 'dev' && value !== 'test') {
    throw new Error(`APP_ENV inválido: "${value}". Use "dev" ou "test".`);
  }
  return value;
}

export function buildContainer(appEnv: AppEnv = resolveAppEnv()): Container {
  const container = new Container();

  container.bind<IPaymentMethod>(TYPES.PaymentMethod).to(CreditCardPayment);
  container.bind<IPaymentMethod>(TYPES.PaymentMethod).to(DebitCardPayment);
  container.bind<IPaymentMethod>(TYPES.PaymentMethod).to(PixPayment);
  container.bind<PaymentMethodRegistry>(TYPES.PaymentMethodRegistry).to(PaymentMethodRegistry);

  container.bind<PrismaClient>(TYPES.PrismaClient).toDynamicValue(() => new PrismaClient()).inSingletonScope();
  container.bind<IProductRepository>(TYPES.ProductRepository).to(PrismaProductRepository).inSingletonScope();

  if (appEnv === 'test') {
    container.bind<IMailProvider>(TYPES.MailProvider).to(ConsoleMailProvider).inSingletonScope();
    container.bind<IOrderRepository>(TYPES.OrderRepository).to(InMemoryOrderRepository).inSingletonScope();
  } else {
    container.bind<IMailProvider>(TYPES.MailProvider).to(EtherealMailProvider).inSingletonScope();
    container.bind<IOrderRepository>(TYPES.OrderRepository).to(PrismaOrderRepository).inSingletonScope();
  }

  container.bind<NotificationService>(TYPES.NotificationService).to(NotificationService);
  container.bind<OrderService>(TYPES.OrderService).to(OrderService);
  container.bind<OrderController>(TYPES.OrderController).to(OrderController);

  return container;
}

export const container = buildContainer();
