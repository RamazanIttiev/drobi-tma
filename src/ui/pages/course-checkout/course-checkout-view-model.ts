import { useCloudStorage } from "@/hooks/use-cloud-storage.ts";
import { ICreatePayment, Payment } from "@a2seven/yoo-checkout";
import { createPaymentFroApi } from "@/services/payment/create-payment.ts";

interface CourseCheckoutViewModel {
  getPaymentToken: () => Promise<string | undefined>;
  getPaymentMethodId: () => Promise<string | undefined>;
  getLastDigits: () => Promise<string | undefined>;
  setPaymentMethodIdToStorage: (
    payment_method_id: string,
  ) => Promise<void | undefined>;
  setLastDigitsToStorage: (
    payment_method_id: string,
  ) => Promise<void | undefined>;
  deletePaymentToken: () => Promise<void | undefined>;
  deletePaymentMethodId: () => Promise<void | undefined>;
  createPayment: (payload: ICreatePayment) => Promise<Payment | undefined>;
}

export const useCourseCheckoutViewModel = (): CourseCheckoutViewModel => {
  const { getItem, deleteItem, setItem } = useCloudStorage();

  const getPaymentToken = async () => {
    return getItem(["payment_token"])?.then((res) => {
      return res.payment_token === "" ? undefined : res.payment_token;
    });
  };

  const getPaymentMethodId = async () => {
    return getItem(["payment_method_id"])?.then((res) => {
      return res.payment_method_id === "" ? undefined : res.payment_method_id;
    });
  };

  const getLastDigits = async () => {
    return getItem(["last_digits"])?.then((res) => {
      return res.last_digits === "" ? undefined : res.last_digits;
    });
  };

  const setPaymentMethodIdToStorage = async (value: string) => {
    return setItem("payment_method_id", value);
  };

  const setLastDigitsToStorage = async (value: string) => {
    return setItem("last_digits", value);
  };

  const deletePaymentToken = async () => {
    return deleteItem(["payment_token"]);
  };

  const deletePaymentMethodId = async () => {
    return deleteItem(["payment_method_id"]);
  };

  const createPayment = async (payload: ICreatePayment) => {
    return await createPaymentFroApi(payload);
  };

  return {
    getPaymentToken,
    getPaymentMethodId,
    getLastDigits,
    setPaymentMethodIdToStorage,
    setLastDigitsToStorage,
    deletePaymentToken,
    deletePaymentMethodId,
    createPayment,
  };
};
