import { useState } from "react";
import {
  AvailablePaymentData,
  DEFAULT_PAYMENT_METHOD,
  getDefaultPayload,
} from "@/ui/pages/payment/payment.model.ts";
import { usePersonalDetails } from "@/context/personal-details.context.tsx";
import { addStudyRequestFromApi } from "@/services/studyRequest/add-study-request.ts";
import { usePaymentViewModel } from "@/ui/pages/payment/payment-view-model.ts";
import { Payment } from "@a2seven/yoo-checkout";
import { PersonalDetails } from "@/ui/pages/personal-details/personal-details.model.ts";

interface CourseCheckoutViewModel {
  personalDetails: PersonalDetails;
  availablePaymentData: AvailablePaymentData[] | undefined;
  selectedPaymentData: AvailablePaymentData | undefined;
  paymentDataLabel: string;
  personalDetailsLabel: string;
  mainButtonText: string;
  addStudy: () => Promise<void>;
  createPayment: (state: any) => Promise<Payment | undefined>;
  changeAvailablePaymentData: (data: AvailablePaymentData[]) => void;
  changeSelectedPaymentData: (data: AvailablePaymentData) => void;
}

export const useCourseCheckoutViewModel = (): CourseCheckoutViewModel => {
  const { personalDetails } = usePersonalDetails();
  const paymentVM = usePaymentViewModel();

  const [availablePaymentData, setAvailablePaymentData] = useState<
    AvailablePaymentData[] | undefined
  >(undefined);
  const [selectedPaymentData, setSelectedPaymentData] = useState<
    AvailablePaymentData | undefined
  >(DEFAULT_PAYMENT_METHOD);

  const addStudy = async () => {
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

  return {
    personalDetails,
    selectedPaymentData,
    availablePaymentData,
    paymentDataLabel: getPaymentDataLabel(),
    personalDetailsLabel: personalDetails.name,
    mainButtonText,
    createPayment,
    addStudy,
    changeAvailablePaymentData,
    changeSelectedPaymentData,
  };
};
