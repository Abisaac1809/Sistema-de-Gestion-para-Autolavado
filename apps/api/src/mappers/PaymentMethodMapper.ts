import PaymentMethod from '../entities/PaymentMethod';
import { PublicPaymentMethod } from '../types/dtos/PaymentMethod.dto';

export default class PaymentMethodMapper {
    static toPublic(paymentMethod: PaymentMethod): PublicPaymentMethod {
        return {
            id: paymentMethod.id,
            name: paymentMethod.name,
            description: paymentMethod.description,
            currency: paymentMethod.currency,
            bankName: paymentMethod.bankName,
            accountHolder: paymentMethod.accountHolder,
            accountNumber: paymentMethod.accountNumber,
            idCard: paymentMethod.idCard,
            phoneNumber: paymentMethod.phoneNumber,
            email: paymentMethod.email,
            isActive: paymentMethod.isActive,
            createdAt: paymentMethod.createdAt,
            updatedAt: paymentMethod.updatedAt,
        };
    }

    static toPublicList(paymentMethods: PaymentMethod[]): PublicPaymentMethod[] {
        return paymentMethods.map(PaymentMethodMapper.toPublic);
    }
}
