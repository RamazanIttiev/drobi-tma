import { useCloudStorage } from "@/hooks/use-cloud-storage.ts";
import { createPaymentFroApi } from "@/ui/pages/course-checkout/services/create-payment.ts";
import { ICreatePayment, Payment } from "@a2seven/yoo-checkout";

interface CourseCheckoutViewModel {
  getPaymentTokenFromStorage: () => Promise<string | undefined>;
  getPaymentMethodIdFromStorage: () => Promise<string | undefined>;
  setPaymentMethodIdToStorage: (
    payment_method_id: string,
  ) => Promise<void | undefined>;
  setLastDigitsToStorage: (
    payment_method_id: string,
  ) => Promise<void | undefined>;
  deletePaymentTokenFromStorage: () => Promise<void | undefined>;
  createPayment: (
    payload: ICreatePayment,
  ) => Promise<{ data: Payment } | undefined>;
}

export const useCourseCheckoutViewModel = (): CourseCheckoutViewModel => {
  const { getItem, deleteItem, setItem } = useCloudStorage();

  const getPaymentTokenFromStorage = async () => {
    return getItem(["payment_token"])?.then((res) => {
      return res.payment_token === "" ? undefined : res.payment_token;
    });
  };

  const getPaymentMethodIdFromStorage = async () => {
    return getItem(["payment_method_id"])?.then((res) => {
      return res.payment_method_id === "" ? undefined : res.payment_method_id;
    });
  };

  const setPaymentMethodIdToStorage = async (value: string) => {
    return setItem("payment_method_id", value);
  };

  const setLastDigitsToStorage = async (value: string) => {
    return setItem("last_digits", value);
  };

  const deletePaymentTokenFromStorage = async () => {
    return deleteItem(["payment_token"]);
  };

  const createPayment = async (payload: ICreatePayment) => {
    return await createPaymentFroApi(payload);
  };

  return {
    getPaymentTokenFromStorage,
    getPaymentMethodIdFromStorage,
    setPaymentMethodIdToStorage,
    setLastDigitsToStorage,
    deletePaymentTokenFromStorage,
    createPayment,
  };
};
