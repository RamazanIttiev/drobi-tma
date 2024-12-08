import {
  AvailablePaymentData,
  PaymentData,
  TokenErrorResponse,
  TokenResponse,
} from "@/ui/pages/payment/payment.model.ts";
import { useCloudStorage } from "@/hooks/use-cloud-storage.ts";
import { ICreatePayment, Payment } from "@a2seven/yoo-checkout";
import { createPaymentFromApi } from "@/services/payment/create-payment.ts";
import { getPaymentFromApi } from "@/services/payment/get-payment.ts";

interface PaymentViewModel {
  getPayment: (id: string) => Promise<Payment | undefined>;
  getPendingPayment: () => Promise<Payment | undefined>;
  getPaymentData: () => Promise<AvailablePaymentData[] | undefined>;
  setPaymentData: (data: AvailablePaymentData) => Promise<void | undefined>;
  setPendingPayment: (payment: Payment) => Promise<void | undefined>;
  deletePendingPayment: () => Promise<void | undefined>;
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
  const { getItem, setItem, addItem, deleteItem } = useCloudStorage();

  const getPayment = async (id: string) => {
    return await getPaymentFromApi(id);
  };

  const getPaymentData = async () => {
    return getItem(["payment_data"])?.then((res) => {
      const paymentData = res?.payment_data as AvailablePaymentData[];

      if (paymentData.length !== 0) {
        return paymentData;
      } else return undefined;
    });
  };

  const getPendingPayment = async () => {
    return getItem(["pending_payment"])?.then((res) => {
      return res?.pending_payment as Payment;
    });
  };

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

  const setPendingPayment = async (payment: Payment) => {
    return setItem("pending_payment", payment);
  };

  const deletePendingPayment = async () => {
    return deleteItem("pending_payment");
  };

  const addPaymentData = async (data: AvailablePaymentData) => {
    return addItem("payment_data", [data]);
  };

  const createPayment = async (payload: ICreatePayment) => {
    return await createPaymentFromApi(payload);
  };

  return {
    getPayment,
    getPaymentData,
    getPendingPayment,
    setPaymentData,
    setPendingPayment,
    deletePendingPayment,
    addPaymentData,
    createPayment,
    createPaymentToken,
  };
};
