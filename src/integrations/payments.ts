interface PaymentGateway {
  upi: boolean;
  creditCard: boolean;
  netBanking: boolean;
  wallet: boolean;
}

export const initializePayment = async (amount: number, parkingId: string) => {
  // Integrate with Indian payment gateways:
  // - RazorPay
  // - PayTM
  // - UPI
  // - PhonePe
}; 