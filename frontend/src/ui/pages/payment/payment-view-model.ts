import {
  AvailablePaymentData,
  CreatePayment,
  PaymentDetails,
  TokenErrorResponse,
  TokenResponse,
} from "@/ui/pages/payment/payment.model.ts";
import { useCloudStorage } from "@/hooks/use-cloud-storage.ts";
import { Payment } from "@a2seven/yoo-checkout";
import { createPaymentFromApi } from "@/services/payment/create-payment.ts";
import { getPaymentFromApi } from "@/services/payment/get-payment.ts";

interface PaymentViewModel {
  getPayment: (id: string) => Promise<Payment | undefined>;
  getPendingPayment: () => Promise<Payment | undefined>;
  getPaymentData: () => Promise<AvailablePaymentData[] | undefined>;
  setPaymentData: (data: AvailablePaymentData) => Promise<void | undefined>;
  setPendingPayment: (payment: Payment) => Promise<void | undefined>;
  deletePendingPayment: () => Promise<void | undefined>;
  addPaymentData: (data: AvailablePaymentData) => Promise<void>;
  createPaymentToken: (
    paymentDetails: PaymentDetails,
  ) => Promise<string | TokenErrorResponse>;
  createPayment: (payload: CreatePayment) => Promise<Payment | undefined>;
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
    const existingData = await getPaymentData();

    const isDuplicate = existingData?.some(
      (item) => item.first6 === data.first6 && item.last4 === data.last4,
    );

    if (!isDuplicate) {
      addItem("payment_data", [data]);
    }
  };

  const createPaymentToken = async (
    paymentDetails: PaymentDetails,
  ): Promise<string | TokenErrorResponse> => {
    const expMonth = paymentDetails?.expiryDate?.slice(0, 2);
    const expYear = paymentDetails?.expiryDate?.slice(3, 5);

    return checkoutYooKassa
      .tokenize({
        number: paymentDetails?.cardNumber,
        cvc: paymentDetails?.cvc,
        month: expMonth,
        year: expYear,
      })
      .then(async (res: TokenResponse) =>
        res.status === "success" ? res.data.response.paymentToken : res,
      );
  };

  const createPayment = async (payload: CreatePayment) => {
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
