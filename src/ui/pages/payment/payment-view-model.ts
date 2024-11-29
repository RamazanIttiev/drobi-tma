import {
  AvailablePaymentData,
  PaymentData,
  TokenErrorResponse,
  TokenResponse,
} from "@/ui/pages/payment/payment.model.ts";
import { useCloudStorage } from "@/hooks/use-cloud-storage.ts";
import { ICreatePayment, Payment } from "@a2seven/yoo-checkout";
import { createPaymentFroApi } from "@/services/payment/create-payment.ts";

interface PaymentViewModel {
  setPaymentData: (data: AvailablePaymentData) => Promise<void | undefined>;
  addPaymentData: (data: AvailablePaymentData) => Promise<void | undefined>;
  createPaymentToken: (
    paymentData: PaymentData,
  ) => Promise<string | TokenErrorResponse>;
  createPayment: (payload: ICreatePayment) => Promise<Payment | undefined>;
}

const checkoutYooKassa = window.YooMoneyCheckout(
  import.meta.env.VITE_YOOKASSA_SHOP_ID,
  {
    language: "ru",
  },
);

export const usePaymentViewModel = (): PaymentViewModel => {
  const { setItem, addItem } = useCloudStorage();

  const createPaymentToken = async (
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

  const setPaymentData = async (data: AvailablePaymentData) => {
    return setItem("payment_data", [data]);
  };

  const addPaymentData = async (data: AvailablePaymentData) => {
    return addItem("payment_data", [data]);
  };

  const createPayment = async (payload: ICreatePayment) => {
    return await createPaymentFroApi(payload);
  };

  return {
    setPaymentData,
    addPaymentData,
    createPayment,
    createPaymentToken,
  };
};
