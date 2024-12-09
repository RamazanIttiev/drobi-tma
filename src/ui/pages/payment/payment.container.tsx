import React, { memo, useCallback, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { usePayment } from "@/context/payment-data.context.tsx";
import { setMainButtonParams } from "@telegram-apps/sdk-react";
import {
  AvailablePaymentData,
  getPaymentPayload,
  isTokenResponseSuccessful,
  mapErrorsToFields,
} from "@/ui/pages/payment/payment.model.ts";
import { FieldErrors } from "@/common/models.ts";
import { CheckoutPageState } from "@/ui/pages/course-checkout/course-checkout.container.tsx";
import { usePaymentViewModel } from "@/ui/pages/payment/payment-view-model.ts";
import { Payment } from "@a2seven/yoo-checkout";
import { useMainButton } from "@/hooks/use-main-button.ts";
import { PaymentComponent } from "@/ui/pages/payment/payment.component.tsx";
import { usePersonalDetails } from "@/context/personal-details.context.tsx";
import { addStudyRequestFromApi } from "@/services/studyRequest/add-study-request.ts";

import "./payment.css";

export const PaymentPage = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isCVCVisible, setIsCVCVisible] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [fieldError, setFieldError] = useState<string | null>(null);

  const vm = usePaymentViewModel();
  const { personalDetails } = usePersonalDetails();

  const state = location.state as CheckoutPageState;

  const {
    paymentDetails,
    save_payment_method,
    setPaymentDetails,
    setSavePaymentMethod,
  } = usePayment();

  const handleChange =
    (field: keyof typeof paymentDetails) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setPaymentDetails({
        ...paymentDetails,
        [field]: value,
      });

      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    };

  const handleTogglePassword = useCallback(() => {
    setIsCVCVisible((prev) => !prev);
  }, []);

  const setPaymentData = useCallback(
    async (response: Payment) => {
      const last4 = response.payment_method.card?.last4;
      const first6 = response.payment_method.card?.first6;
      const type = response.payment_method.card?.card_type;

      if (!last4 || !first6 || !type) {
        return;
      }

      const paymentData: AvailablePaymentData = {
        id: response.id,
        last4,
        first6,
        type,
      };

      await vm.addPaymentData(paymentData);
    },
    [vm],
  );

  const handlePaymentResponse = useCallback(
    async (response: Payment | undefined) => {
      await addStudyRequestFromApi({
        fullName: personalDetails.name,
        eMail: personalDetails.email,
        phone: personalDetails.phone,
      });

      if (response?.status === "succeeded") {
        setIsLoading(false);
        await setPaymentData(response);
        navigate("/payment-status", { state: { status: response?.status } });
      }

      if (response?.status === "pending") {
        const confirmation_url = response.confirmation.confirmation_url;

        await vm.setPendingPayment(response);

        setMainButtonParams({
          isVisible: false,
        });

        if (confirmation_url) {
          window.location.href = confirmation_url;
        }
      }
    },
    [
      navigate,
      personalDetails.email,
      personalDetails.name,
      personalDetails.phone,
      setPaymentData,
      vm,
    ],
  );

  const handleSubmit = useCallback(async () => {
    try {
      const payment_token = await vm.createPaymentToken(paymentDetails);

      if (!isTokenResponseSuccessful(payment_token)) {
        const fieldErrors = mapErrorsToFields(payment_token);

        setFieldError("Ошибка при создании платежа. Проверьте данные карты");
        setErrors(fieldErrors);
        return;
      }

      const payload = getPaymentPayload({
        payment_token,
        merchant_customer_id: personalDetails.phone,
        save_payment_method,
        description: `${personalDetails.name}: ${personalDetails.phone} (${state.title})`,
        amount: state.price.toString(),
      });

      setIsLoading(true);
      const response = await vm.createPayment(payload);
      await handlePaymentResponse(response);
    } catch (error: unknown) {
      console.log(error);
      setFieldError("Ошибка при создании платежа. Проверьте данные карты");
    }
  }, [
    vm,
    paymentDetails,
    personalDetails.phone,
    personalDetails.name,
    save_payment_method,
    state.title,
    state.price,
    handlePaymentResponse,
  ]);

  const handleSavePaymentDetails = useCallback(() => {
    setSavePaymentMethod(!save_payment_method);
  }, [save_payment_method, setSavePaymentMethod]);

  useMainButton({
    onClick: handleSubmit,
    text: `Оплатить`,
    isLoading,
  });

  return (
    <PaymentComponent
      paymentDetails={paymentDetails}
      errors={errors}
      fieldError={fieldError}
      isCVCVisible={isCVCVisible}
      save_payment_method={save_payment_method}
      handleChange={handleChange}
      handleTogglePassword={handleTogglePassword}
      resetFieldError={() => setFieldError(null)}
      handleSavePaymentDetails={handleSavePaymentDetails}
    />
  );
});
