import { memo, useCallback, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { CourseConfig } from "@/ui/pages/course/course.model.ts";

import {
  hideBackButton,
  setMainButtonParams,
  setMiniAppBackgroundColor,
} from "@telegram-apps/sdk-react";

import {
  AvailablePaymentData,
  DEFAULT_PAYMENT_METHOD,
} from "@/ui/pages/payment/payment.model.ts";

import { CourseCheckoutComponent } from "@/ui/pages/course-checkout/course-checkout.component.tsx";
import { Snackbar } from "@telegram-apps/telegram-ui";

import { useMainButton } from "@/hooks/use-main-button.ts";
import { useCourseCheckoutViewModel } from "@/ui/pages/course-checkout/course-checkout.view-model.ts";

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

  const [personalDetailsLabel, setPersonalDetailsLabel] = useState<
    string | undefined
  >(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [personalDetailsError, setPersonalDetailsError] = useState<
    string | undefined
  >(undefined);

  const checkoutVM = useCourseCheckoutViewModel();

  const handleSubmit = useCallback(async () => {
    if (!personalDetailsLabel) {
      setPersonalDetailsError("Заполните личные данные");
      return;
    }

    setIsLoading(true);

    await checkoutVM.addStudy();

    const response = await checkoutVM.createPayment(state);

    if (response?.confirmation.confirmation_url) {
      hideBackButton();
      setMainButtonParams({ isVisible: false });
      setMiniAppBackgroundColor("#ffffff");

      window.location.href = response?.confirmation.confirmation_url;
    }
  }, [checkoutVM, personalDetailsLabel, state]);

  useMainButton({
    text: checkoutVM.mainButtonText,
    onClick: handleSubmit,
    isLoading,
    isEnabled: personalDetailsLabel !== "",
  });

  useEffect(() => {
    const fetchPaymentData = async () => {
      const bankCardMethod: AvailablePaymentData = {
        id: "bank_card",
        paymentMethodType: "bank_card",
      };

      checkoutVM.changeAvailablePaymentData([
        DEFAULT_PAYMENT_METHOD,
        bankCardMethod,
      ]);
    };

    fetchPaymentData().catch(console.error);
  }, []);

  useEffect(() => {
    const getPersonalDetailsLabel = async () => {
      const label = await checkoutVM.getPersonalDetailsLabel();
      setPersonalDetailsLabel(label);
    };

    getPersonalDetailsLabel().catch(console.error);
  }, [checkoutVM]);

  return (
    <>
      <CourseCheckoutComponent
        config={state.config}
        title={state.title}
        price={state.price}
        paymentDataLabel={checkoutVM.paymentDataLabel}
        personalDetailsLabel={personalDetailsLabel}
        navigateToPersonalData={() => navigate("/personal-details")}
        isPaymentDataSectionShown={false}
        handleSubmit={handleSubmit}
      />
      {/*<PaymentMethodSelectModalComponent*/}
      {/*  state={state}*/}
      {/*  isOpen={isModalOpen}*/}
      {/*  onChange={setIsModalOpen}*/}
      {/*  options={checkoutVM.availablePaymentData}*/}
      {/*  selectedOption={checkoutVM.selectedPaymentData}*/}
      {/*  onOptionSelect={checkoutVM.changeSelectedPaymentData}*/}
      {/*/>*/}
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
