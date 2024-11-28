import { useCloudStorage } from "@/hooks/use-cloud-storage.ts";
import { ICreatePayment, Payment } from "@a2seven/yoo-checkout";
import { createPaymentFroApi } from "@/services/payment/create-payment.ts";
import { AvailablePaymentData } from "@/ui/pages/payment/payment.model.ts";

interface CourseCheckoutViewModel {
  getPaymentData: () => Promise<AvailablePaymentData[] | undefined>;
  getPaymentToken: () => Promise<string | undefined>;
  getSelectedPaymentData: () => Promise<AvailablePaymentData | undefined>;
  setPaymentData: (data: AvailablePaymentData) => Promise<void | undefined>;
  setSelectedPaymentData: (
    data: AvailablePaymentData,
  ) => Promise<void | undefined>;
  deletePaymentToken: () => Promise<void | undefined>;
  createPayment: (payload: ICreatePayment) => Promise<Payment | undefined>;
}

export const useCourseCheckoutViewModel = (): CourseCheckoutViewModel => {
  const { getItem, deleteItem, setItem } = useCloudStorage();

  const getPaymentData = async () => {
    return getItem(["payment_data"])?.then((res) => {
      const paymentData = res?.payment_data as AvailablePaymentData[];

      if (paymentData.length !== 0) {
        return paymentData;
      } else return undefined;
    });
  };

  const getPaymentToken = async () => {
    return getItem(["payment_token"])?.then((res) => {
      if (typeof res?.payment_token === "string") {
        return res?.payment_token === "" ? undefined : res?.payment_token;
      }
    });
  };

  const getSelectedPaymentData = async () => {
    return getItem(["selected_payment_data"])?.then((res) => {
      if (typeof res?.selected_payment_data !== "string") {
        return res?.selected_payment_data as AvailablePaymentData;
      }
    });
  };

  const setPaymentData = async (data: AvailablePaymentData) => {
    return setItem("payment_data", [data]);
  };

  const setSelectedPaymentData = async (value: AvailablePaymentData) => {
    return setItem("selected_payment_data", value);
  };

  const deletePaymentToken = async () => {
    return deleteItem(["payment_token"]);
  };

  const createPayment = async (payload: ICreatePayment) => {
    return await createPaymentFroApi(payload);
  };

  return {
    getPaymentData,
    getSelectedPaymentData,
    getPaymentToken,
    setPaymentData,
    setSelectedPaymentData,
    deletePaymentToken,
    createPayment,
  };
};
