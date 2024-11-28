import {
  PaymentData,
  TokenErrorResponse,
  TokenResponse,
} from "@/ui/pages/payment/payment.model.ts";
import { useCloudStorage } from "@/hooks/use-cloud-storage.ts";

interface PaymentViewModel {
  fetchPaymentToken: (
    paymentData: PaymentData,
  ) => Promise<string | TokenErrorResponse>;
  setPaymentToken: (token: string) => Promise<void>;
}

const checkoutYooKassa = window.YooMoneyCheckout(
  import.meta.env.VITE_YOOKASSA_SHOP_ID,
  {
    language: "ru",
  },
);

export const usePaymentViewModel = (): PaymentViewModel => {
  const { setItem } = useCloudStorage();

  const fetchPaymentToken = async (
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

  const setPaymentToken = async (token: string) => {
    await setItem("payment_token", token);
  };

  return {
    fetchPaymentToken,
    setPaymentToken,
  };
};
