import { useState } from "react";
import {
  AvailablePaymentData,
  DEFAULT_PAYMENT_METHOD,
  getDefaultPayload,
} from "@/ui/pages/payment/payment.model.ts";
import { addStudyRequestFromApi } from "@/api/studyRequest/add-study-request.ts";
import { usePaymentViewModel } from "@/ui/pages/payment/payment-view-model.ts";
import { Payment } from "@a2seven/yoo-checkout";
import { PersonalDetails } from "@/ui/pages/personal-details/personal-details.model.ts";
import { useCloudStorage } from "@/hooks/use-cloud-storage.ts";

interface CourseCheckoutViewModel {
  availablePaymentData: AvailablePaymentData[] | undefined;
  selectedPaymentData: AvailablePaymentData | undefined;
  paymentDataLabel: string;
  mainButtonText: string;
  addStudy: () => Promise<void>;
  createPayment: (state: any) => Promise<Payment | undefined>;
  changeAvailablePaymentData: (data: AvailablePaymentData[]) => void;
  changeSelectedPaymentData: (data: AvailablePaymentData) => void;
  getPersonalDetailsLabel: () => Promise<string>;
}

export const useCourseCheckoutViewModel = (): CourseCheckoutViewModel => {
  const paymentVM = usePaymentViewModel();
  const { getItem } = useCloudStorage();

  const [availablePaymentData, setAvailablePaymentData] = useState<
    AvailablePaymentData[] | undefined
  >(undefined);
  const [selectedPaymentData, setSelectedPaymentData] = useState<
    AvailablePaymentData | undefined
  >(DEFAULT_PAYMENT_METHOD);

  const getPersonalDetails = async () => {
    const data = await getItem(["personal_details"]);

    return data?.personal_details as PersonalDetails;
  };

  const addStudy = async () => {
    const personalDetails = await getPersonalDetails();
    try {
      await addStudyRequestFromApi({
        fullName: personalDetails.name,
        eMail: personalDetails.email,
        phone: personalDetails.phone,
      });
    } catch (error) {
      console.error("Failed to add study request:", error);
    }
  };

  const createPayment = async (state: any) => {
    const personalDetails = await getPersonalDetails();

    const payload = getDefaultPayload({
      state,
      personalDetails,
    });

    return await paymentVM.createPayment(payload);
  };

  const changeAvailablePaymentData = (data: AvailablePaymentData[]) => {
    setAvailablePaymentData(data);
  };

  const changeSelectedPaymentData = (data: AvailablePaymentData) => {
    setSelectedPaymentData(data);
  };

  const getPaymentDataLabel = () => {
    switch (selectedPaymentData?.paymentMethodType) {
      case "sberbank":
        return "SberPay";
      case "bank_card":
        return `Банковская карта`;
      default:
        return "SberPay";
    }
  };

  const mainButtonText = "К оплате";

  const getPersonalDetailsLabel = async () => {
    const personalDetails = await getPersonalDetails();

    return personalDetails.name;
  };

  return {
    selectedPaymentData,
    availablePaymentData,
    paymentDataLabel: getPaymentDataLabel(),
    getPersonalDetailsLabel,
    mainButtonText,
    createPayment,
    addStudy,
    changeAvailablePaymentData,
    changeSelectedPaymentData,
  };
};
