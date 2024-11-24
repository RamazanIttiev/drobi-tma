import {
  PaymentData,
  TokenErrorResponse,
  TokenResponse,
} from "@/ui/pages/payment/payment.model.ts";

interface PaymentViewModel {
  getPaymentToken: (
    paymentData: PaymentData,
  ) => Promise<string | TokenErrorResponse>;
}

const checkoutYooKassa = window.YooMoneyCheckout(
  import.meta.env.VITE_YOOKASSA_SHOP_ID,
  {
    language: "ru",
  },
);

export const usePaymentViewModel = (): PaymentViewModel => {
  const getPaymentToken = async (
    paymentData: PaymentData,
  ): Promise<string | TokenErrorResponse> => {
    const expMonth = paymentData?.expiryDate?.slice(0, 2);
    const expYear = paymentData?.expiryDate?.slice(3, 5);

    return checkoutYooKassa
      .tokenize({
        number: paymentData?.cardNumber,
        cvc: paymentData?.cvc,
        month: expMonth,
        year: expYear,
      })
      .then(async (res: TokenResponse) =>
        res.status === "success" ? res.data.response.paymentToken : res,
      );
  };

  return {
    getPaymentToken,
  };
};
