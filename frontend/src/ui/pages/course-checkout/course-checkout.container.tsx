import { memo, useCallback, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { CourseConfig } from "@/ui/pages/course/course.model.ts";

import { setMainButtonParams } from "@telegram-apps/sdk-react";

import { DEFAULT_PAYMENT_METHOD } from "@/ui/pages/payment/payment.model.ts";

import { CourseCheckoutComponent } from "@/ui/pages/course-checkout/course-checkout.component.tsx";
import { PaymentMethodSelectModalComponent } from "@/ui/organisms/payment-method-select-modal/payment-method-select-modal.component.tsx";
import { Payment } from "@a2seven/yoo-checkout";
import { Snackbar } from "@telegram-apps/telegram-ui";

import { useMainButton } from "@/hooks/use-main-button.ts";
import { usePaymentViewModel } from "@/ui/pages/payment/payment-view-model.ts";
import { useCourseCheckoutViewModel } from "@/ui/pages/course-checkout/course-checkout.view-model.ts";

import { handlePaymentPending } from "@/ui/pages/payment/utils/payment.ts";

import "./course-checkout.css";

export interface CheckoutPageState {
  title: string;
  price: number;
  config: CourseConfig;
}

export const CourseCheckoutPage = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CheckoutPageState;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [personalDetailsError, setPersonalDetailsError] = useState<
    string | undefined
  >(undefined);

  const paymentVM = usePaymentViewModel();
  const checkoutVM = useCourseCheckoutViewModel();

  const handlePaymentSuccess = useCallback(
    (response: Payment) => {
      setIsLoading(false);
      navigate("/payment-status", { state: { status: response?.status } });
    },
    [navigate],
  );

  const handleSubmit = useCallback(async () => {
    if (!checkoutVM.personalDetails.name) {
      setPersonalDetailsError("Заполните личные данные");
      return;
    }

    setIsLoading(true);

    setIsModalOpen(false);

    await checkoutVM.addStudy();

    const response = await checkoutVM.createPayment(state);

    if (response?.status === "succeeded") {
      handlePaymentSuccess(response);
    } else if (response?.status === "pending") {
      await handlePaymentPending(response, paymentVM.setPendingPayment);

      setMainButtonParams({
        isVisible: false,
      });
    }
  }, [checkoutVM, handlePaymentSuccess, paymentVM.setPendingPayment, state]);

  useMainButton({
    text: checkoutVM.mainButtonText,
    onClick: handleSubmit,
    isLoading,
    isEnabled: checkoutVM.personalDetails.name !== "",
  });

  useEffect(() => {
    const fetchPaymentData = async () => {
      const availablePayment = await paymentVM.getPaymentData();

      if (availablePayment) {
        checkoutVM.changeAvailablePaymentData([
          DEFAULT_PAYMENT_METHOD,
          ...availablePayment,
        ]);
      } else {
        checkoutVM.changeAvailablePaymentData([DEFAULT_PAYMENT_METHOD]);
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
        paymentDataLabel={checkoutVM.paymentDataLabel}
        personalDetailsLabel={checkoutVM.personalDetailsLabel}
        navigateToPersonalData={() => navigate("/personal-details")}
        isPaymentDataSectionShown={checkoutVM.personalDetails.name !== ""}
        openModal={() => setIsModalOpen(true)}
        handleSubmit={handleSubmit}
      />
      <PaymentMethodSelectModalComponent
        state={state}
        isOpen={isModalOpen}
        onChange={setIsModalOpen}
        options={checkoutVM.availablePaymentData}
        selectedOption={checkoutVM.selectedPaymentData}
        onOptionSelect={checkoutVM.changeSelectedPaymentData}
      />
      {personalDetailsError && (
        <Snackbar
          children={personalDetailsError}
          duration={5000}
          onClose={() => setPersonalDetailsError(undefined)}
        />
      )}
    </>
  );
});
