import Payment from "../entities/Payment";
import { PublicPayment } from "../types/dtos/Payment.dto";
import PaymentMethodMapper from "./PaymentMethodMapper";

export default class PaymentMapper {
  static toPublicPayment(payment: Payment): PublicPayment {
    return {
      id: payment.id,
      orderId: payment.orderId,
      saleId: payment.saleId,
      amountUsd: payment.amountUsd,
      exchangeRate: payment.exchangeRate,
      amountVes: payment.amountVes,
      originalCurrency: payment.originalCurrency,
      paymentDate: payment.paymentDate,
      notes: payment.notes,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      paymentMethod: PaymentMethodMapper.toPublic(payment.paymentMethod),
    };
  }

  static toPublicPaymentList(payments: Payment[]): PublicPayment[] {
    return payments.map(PaymentMapper.toPublicPayment);
  }
}
