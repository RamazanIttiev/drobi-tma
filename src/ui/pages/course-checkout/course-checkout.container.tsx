import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { CourseConfig } from "@/ui/pages/course/course.model.ts";

import { setMainButtonParams } from "@telegram-apps/sdk-react";

import {
  AvailablePaymentData,
  DEFAULT_PAYMENT_METHOD,
  getSavedCardPaymentPayload,
  getSberPayPaymentPayload,
} from "@/ui/pages/payment/payment.model.ts";

import { CourseCheckoutComponent } from "@/ui/pages/course-checkout/course-checkout.component.tsx";
import { PaymentMethodSelectModalComponent } from "@/ui/organisms/payment-method-select-modal/payment-method-select-modal.component.tsx";
import { Payment } from "@a2seven/yoo-checkout";

import { useMainButton } from "@/hooks/use-main-button.ts";
import { usePaymentViewModel } from "@/ui/pages/payment/payment-view-model.ts";
import { usePersonalDetails } from "@/context/personal-details.context.tsx";

import { handlePaymentPending } from "@/ui/pages/payment/utils/payment.ts";
import { addStudyRequestFromApi } from "@/services/studyRequest/add-study-request.ts";

import "./course-checkout.css";

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
  >(DEFAULT_PAYMENT_METHOD);

  const vm = usePaymentViewModel();
  const { personalDetails } = usePersonalDetails();

  const paymentDataLabel = useMemo(() => {
    if (selectedPaymentData) {
      switch (selectedPaymentData.paymentMethodType) {
        case "sberbank":
          return "SberPay";
        case "sbp":
          return "СБП";
        case "bank_card":
          return `**** ${selectedPaymentData.last4}`;
      }
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

  const handlePaymentSuccess = useCallback(
    (response: Payment) => {
      setIsLoading(false);
      navigate("/payment-status", { state: { status: response?.status } });
    },
    [navigate],
  );

  const handlePayment = useCallback(async () => {
    switch (selectedPaymentData?.paymentMethodType) {
      case "bank_card": {
        const payload = getSavedCardPaymentPayload({
          state,
          personalDetails,
          payment_method_id: selectedPaymentData.id,
        });

        return await vm.createPayment(payload);
      }
      case "sberbank": {
        const payload = getSberPayPaymentPayload({ state, personalDetails });
        return await vm.createPayment(payload);
      }
    }
  }, [selectedPaymentData, state, personalDetails, vm]);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);

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
  }, [
    handlePayment,
    handlePaymentSuccess,
    handleStudyRequest,
    vm.setPendingPayment,
  ]);

  useMainButton({
    text: mainButtonText,
    onClick: handleSubmit,
    isLoading,
  });

  useEffect(() => {
    const fetchPaymentData = async () => {
      const data = await vm.getPaymentData();
      if (data) {
        setAvailablePaymentData(data);
      } else {
        setAvailablePaymentData([DEFAULT_PAYMENT_METHOD]);
      }
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
        showPaymentDataSection={personalDetails.name !== ""}
        openModal={() => setIsModalOpen(true)}
        handleSubmit={handleSubmit}
      />
      <PaymentMethodSelectModalComponent
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
