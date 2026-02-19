import { PaymentToCreateType } from "../../schemas/Payment.schema";
import {
  PublicPayment,
  PaymentFiltersForService,
  ListOfPayments,
} from "../../types/dtos/Payment.dto";

export default interface IPaymentService {
  addPaymentToOrder(
    orderId: string,
    data: PaymentToCreateType,
  ): Promise<PublicPayment>;
  addPaymentToSale(
    saleId: string,
    data: PaymentToCreateType,
  ): Promise<PublicPayment>;
  getPaymentById(id: string): Promise<PublicPayment>;
  listPaymentsByTarget(
    filters: PaymentFiltersForService,
  ): Promise<ListOfPayments>;
}
