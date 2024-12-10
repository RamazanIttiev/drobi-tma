import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { CourseConfig } from "@/ui/pages/course/course.model.ts";

import { setMainButtonParams } from "@telegram-apps/sdk-react";

import {
  AvailablePaymentData,
  getPaymentPayload,
} from "@/ui/pages/payment/payment.model.ts";

import { CourseCheckoutComponent } from "@/ui/pages/course-checkout/course-checkout.component.tsx";
import { CardSelectModalComponent } from "@/ui/organisms/card-select-model/card-select-modal.component.tsx";

import { useMainButton } from "@/hooks/use-main-button.ts";
import { usePaymentViewModel } from "@/ui/pages/payment/payment-view-model.ts";

import { usePersonalDetails } from "@/context/personal-details.context.tsx";
import { addStudyRequestFromApi } from "@/services/studyRequest/add-study-request.ts";

import "./course-checkout.css";
import { Payment } from "@a2seven/yoo-checkout";
import { handlePaymentPending } from "@/ui/pages/payment/utils/payment.ts";

export interface CheckoutPageState {
  title: string;
  price: number;
  config: CourseConfig;
}

export const CourseCheckoutPage = memo(() => {
  const location = useLocation();
  const state = location.state as CheckoutPageState;
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availablePaymentData, setAvailablePaymentData] = useState<
    AvailablePaymentData[] | undefined
  >(undefined);
  const [selectedPaymentData, setSelectedPaymentData] = useState<
    AvailablePaymentData | undefined
  >();

  const vm = usePaymentViewModel();
  const { personalDetails } = usePersonalDetails();

  const paymentDataLabel = useMemo(() => {
    if (selectedPaymentData) {
      return `**** ${selectedPaymentData.last4}`;
    }
  }, [selectedPaymentData]);

  const personalDetailsLabel = useMemo(() => {
    if (personalDetails) {
      return personalDetails.name;
    }
  }, [personalDetails]);

  const mainButtonText = useMemo(
    () => (selectedPaymentData ? "Оплатить" : "К оплате"),
    [selectedPaymentData],
  );

  const navigateToPayment = useCallback(() => {
    navigate("/payment-details", {
      state,
    });
  }, [navigate, state]);

  const handleStudyRequest = useCallback(async () => {
    try {
      await addStudyRequestFromApi({
        fullName: personalDetails.name,
        eMail: personalDetails.email,
        phone: personalDetails.phone,
      });
    } catch (error) {
      console.error("Failed to add study request:", error);
      setIsLoading(false);
    }
  }, [personalDetails.name, personalDetails.email, personalDetails.phone]);

  const handlePayment = useCallback(async () => {
    const payload = getPaymentPayload({
      payment_method_id: selectedPaymentData?.id,
      merchant_customer_id: personalDetails.phone,
      description: `${personalDetails.name}: ${personalDetails.phone} (${state.title})`,
      amount: state.price.toString(),
    });

    return await vm.createPayment(payload);
  }, [
    selectedPaymentData?.id,
    personalDetails.phone,
    personalDetails.name,
    state.title,
    state.price,
    vm,
  ]);

  const handlePaymentSuccess = useCallback(
    (response: Payment) => {
      setIsLoading(false);
      navigate("/payment-status", { state: { status: response?.status } });
    },
    [navigate],
  );

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);

    if (availablePaymentData) {
      setIsModalOpen(false);

      await handleStudyRequest();

      const response = await handlePayment();

      if (response?.status === "succeeded") {
        handlePaymentSuccess(response);
      } else if (response?.status === "pending") {
        await handlePaymentPending(
          response,
          vm.setPendingPayment,
          setMainButtonParams,
        );
      }
    } else {
      navigateToPayment();
    }
  }, [
    availablePaymentData,
    handleStudyRequest,
    handlePayment,
    handlePaymentSuccess,
    vm.setPendingPayment,
    navigateToPayment,
  ]);

  useMainButton({
    text: mainButtonText,
    onClick: handleSubmit,
    isLoading,
  });

  useEffect(() => {
    const fetchPaymentData = async () => {
      const data = await vm.getPaymentData();
      setAvailablePaymentData(data);
      setSelectedPaymentData(data?.[0]);
    };

    fetchPaymentData().catch(console.error);
  }, []);

  return (
    <>
      <CourseCheckoutComponent
        config={state.config}
        title={state.title}
        price={state.price}
        paymentDataLabel={paymentDataLabel}
        personalDetailsLabel={personalDetailsLabel}
        navigateToPersonalData={() => navigate("/personal-details")}
        showPaymentDataSection={
          availablePaymentData && personalDetails.name !== ""
        }
        openModal={() => setIsModalOpen(true)}
      />
      <CardSelectModalComponent
        state={state}
        isOpen={isModalOpen}
        onChange={setIsModalOpen}
        options={availablePaymentData}
        selectedOption={selectedPaymentData}
        onOptionSelect={setSelectedPaymentData}
      />
    </>
  );
});
