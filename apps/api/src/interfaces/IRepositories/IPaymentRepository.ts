import Payment from "../../entities/Payment";
import {
  PaymentToSave,
  PaymentFiltersForRepository,
  PaymentFiltersForCount,
} from "../../types/dtos/Payment.dto";

export default interface IPaymentRepository {
  create(data: PaymentToSave): Promise<Payment>;
  getById(id: string): Promise<Payment | null>;
  listByTarget(filters: PaymentFiltersForRepository): Promise<Payment[]>;
  countByTarget(filters: PaymentFiltersForCount): Promise<number>;
  sumByOrderId(orderId: string): Promise<number>;
  sumBySaleId(saleId: string): Promise<number>;
}
