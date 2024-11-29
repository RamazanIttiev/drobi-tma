import { useCloudStorage } from "@/hooks/use-cloud-storage.ts";
import { ICreatePayment, Payment } from "@a2seven/yoo-checkout";
import { createPaymentFroApi } from "@/services/payment/create-payment.ts";
import { AvailablePaymentData } from "@/ui/pages/payment/payment.model.ts";

interface CourseCheckoutViewModel {
  getPaymentData: () => Promise<AvailablePaymentData[] | undefined>;
  createPayment: (payload: ICreatePayment) => Promise<Payment | undefined>;
}

export const useCourseCheckoutViewModel = (): CourseCheckoutViewModel => {
  const { getItem } = useCloudStorage();

  const getPaymentData = async () => {
    return getItem(["payment_data"])?.then((res) => {
      const paymentData = res?.payment_data as AvailablePaymentData[];

      if (paymentData.length !== 0) {
        return paymentData;
      } else return undefined;
    });
  };

  const createPayment = async (payload: ICreatePayment) => {
    return await createPaymentFroApi(payload);
  };

  return {
    getPaymentData,
    createPayment,
  };
};
