import { PrismaClient } from "../generated/prisma";
import Payment from "../entities/Payment";
import IPaymentRepository from "../interfaces/IRepositories/IPaymentRepository";
import PaymentMethod from "../entities/PaymentMethod";
import {
  PaymentToSave,
  PaymentFiltersForRepository,
  PaymentFiltersForCount,
} from "../types/dtos/Payment.dto";

export default class PrismaPaymentRepository implements IPaymentRepository {
  constructor(private prisma: PrismaClient) {}

  private readonly includeRelations = {
    paymentMethod: true,
  } as const;

  async create(data: PaymentToSave): Promise<Payment> {
    const created = await this.prisma.payment.create({
      data: {
        orderId: data.orderId ?? null,
        saleId: data.saleId ?? null,
        paymentMethodId: data.paymentMethodId,
        amountUsd: data.amountUsd,
        exchangeRate: data.exchangeRate,
        amountVes: data.amountVes,
        originalCurrency: data.originalCurrency,
        paymentDate: data.paymentDate ?? new Date(),
        notes: data.notes ?? null,
      },
      include: this.includeRelations,
    });
    return this.mapToEntity(created);
  }

  async getById(id: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findFirst({
      where: { id, deletedAt: null },
      include: this.includeRelations,
    });
    return payment ? this.mapToEntity(payment) : null;
  }

  async listByTarget(filters: PaymentFiltersForRepository): Promise<Payment[]> {
    const where: any = { deletedAt: null };
    if (filters.orderId) where.orderId = filters.orderId;
    if (filters.saleId) where.saleId = filters.saleId;

    const payments = await this.prisma.payment.findMany({
      where,
      skip: filters.offset,
      take: filters.limit,
      orderBy: { paymentDate: "desc" },
      include: this.includeRelations,
    });
    return payments.map((p) => this.mapToEntity(p));
  }

  async countByTarget(filters: PaymentFiltersForCount): Promise<number> {
    const where: any = { deletedAt: null };
    if (filters.orderId) where.orderId = filters.orderId;
    if (filters.saleId) where.saleId = filters.saleId;

    return await this.prisma.payment.count({ where });
  }

  async sumByOrderId(orderId: string): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      where: {
        orderId,
        deletedAt: null,
      },
      _sum: {
        amountUsd: true,
      },
    });
    // Convert Decimal to number, default to 0 if no payments
    return result._sum.amountUsd?.toNumber() ?? 0;
  }

  async sumBySaleId(saleId: string): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      where: {
        saleId,
        deletedAt: null,
      },
      _sum: {
        amountUsd: true,
      },
    });
    return result._sum.amountUsd?.toNumber() ?? 0;
  }

  private mapToEntity(prismaPayment: any): Payment {
    const paymentMethod = new PaymentMethod({
      id: prismaPayment.paymentMethod.id,
      name: prismaPayment.paymentMethod.name,
      description: prismaPayment.paymentMethod.description,
      currency: prismaPayment.paymentMethod.currency,
      bankName: prismaPayment.paymentMethod.bankName,
      accountHolder: prismaPayment.paymentMethod.accountHolder,
      accountNumber: prismaPayment.paymentMethod.accountNumber,
      idCard: prismaPayment.paymentMethod.idCard,
      phoneNumber: prismaPayment.paymentMethod.phoneNumber,
      email: prismaPayment.paymentMethod.email,
      isActive: prismaPayment.paymentMethod.isActive,
      createdAt: prismaPayment.paymentMethod.createdAt,
      updatedAt: prismaPayment.paymentMethod.updatedAt,
      deletedAt: prismaPayment.paymentMethod.deletedAt,
    });

    return new Payment({
      id: prismaPayment.id,
      orderId: prismaPayment.orderId,
      saleId: prismaPayment.saleId,
      paymentMethod,
      amountUsd: prismaPayment.amountUsd.toNumber(),
      exchangeRate: prismaPayment.exchangeRate.toNumber(),
      amountVes: prismaPayment.amountVes.toNumber(),
      originalCurrency: prismaPayment.originalCurrency as 'USD' | 'VES',
      paymentDate: prismaPayment.paymentDate,
      notes: prismaPayment.notes,
      createdAt: prismaPayment.createdAt,
      updatedAt: prismaPayment.updatedAt,
      deletedAt: prismaPayment.deletedAt,
    });
  }
}
