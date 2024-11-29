import React, { memo, useCallback, useEffect, useState } from "react";
import { Page } from "@/ui/organisms/page/page";
import {
  Cell,
  IconButton,
  Input,
  List,
  Section,
  Snackbar,
  Switch,
} from "@telegram-apps/telegram-ui";
import { useLocation } from "react-router-dom";
import { usePayment } from "@/context/payment-data.context.tsx";
import { PatternFormat } from "react-number-format";
import {
  mainButton,
  mountMainButton,
  onMainButtonClick,
  setMainButtonParams,
} from "@telegram-apps/sdk-react";
import {
  AvailablePaymentData,
  FieldErrors,
  getPaymentPayload,
  isTokenResponseSuccessful,
  mapErrorsToFields,
} from "@/ui/pages/payment/payment.model.ts";
import { usePaymentViewModel } from "@/ui/pages/payment/payment-view-model.ts";
import { Payment } from "@a2seven/yoo-checkout";
import { CheckoutPageState } from "@/ui/pages/course-checkout/course-checkout.component.tsx";

import IconEyeOpened from "@/assets/icons/eye-opened.svg";
import IconEyeClosed from "@/assets/icons/eye-closed.svg";
import IconCard from "@/assets/icons/card-icon.svg";

import "./payment.css";

export const PaymentPage = memo(() => {
  const location = useLocation();

  const [isCVCVisible, setIsCVCVisible] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [tokenError, setTokenError] = useState<string | null>(null);

  const vm = usePaymentViewModel();
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

  const successfulPayment = useCallback(
    async (response: Payment | undefined) => {
      if (response?.status === "succeeded") {
        const last4 = response.payment_method.card?.last4;
        const first6 = response.payment_method.card?.first6;
        const type = response.payment_method.card?.card_type;

        if (last4 && first6 && type) {
          const paymentData: AvailablePaymentData = {
            id: response.id,
            last4,
            first6,
            type,
          };

          await vm.addPaymentData(paymentData);
        }
      }
    },
    [vm],
  );

  const handleSubmit = useCallback(async () => {
    try {
      const payment_token = await vm.createPaymentToken(paymentDetails);

      if (!isTokenResponseSuccessful(payment_token)) {
        const fieldErrors = mapErrorsToFields(payment_token);

        setTokenError("Ошибка при создании платежа. Проверьте данные карты");
        setErrors(fieldErrors);
        return;
      }

      const payload = getPaymentPayload({
        payment_token,
        merchant_customer_id: "",
        save_payment_method,
        description: state.title,
        amount: state.price.toString(),
      });

      const response = await vm.createPayment(payload);
      await successfulPayment(response);
    } catch (error: unknown) {
      console.log(error);
      setTokenError("Ошибка при создании платежа. Проверьте данные карты");
    }
  }, [
    paymentDetails,
    save_payment_method,
    state.price,
    state.title,
    successfulPayment,
    vm,
  ]);

  const handleSavePaymentDetails = useCallback(() => {
    setSavePaymentMethod(!save_payment_method);
  }, [save_payment_method, setSavePaymentMethod]);

  useEffect(() => {
    mountMainButton();
    setMainButtonParams({
      backgroundColor: "#000000",
      isVisible: true,
      text: `Сохранить`,
      textColor: "#ffffff",
    });

    return () => {
      setMainButtonParams({
        isVisible: false,
      });
    };
  }, []);

  useEffect(() => {
    onMainButtonClick(handleSubmit);

    return () => {
      mainButton.offClick(handleSubmit);
    };
  }, [handleSubmit]);

  return (
    <Page verticalPaddingDisabled horizontalPaddingDisabled>
      <List>
        <Section header="Данные карты">
          <PatternFormat
            customInput={Input}
            className={"payment__card-number"}
            format={"#### #### #### ####"}
            required
            status={errors["cardNumber"] ? "error" : "default"}
            inputMode={"numeric"}
            autoComplete={"cc-number"}
            header="Номер карты"
            after={<IconCard />}
            placeholder="1234 5678 1234 5678"
            value={paymentDetails.cardNumber}
            onChange={handleChange("cardNumber")}
          />

          <div className={"payment__exp-cvc"}>
            <PatternFormat
              customInput={Input}
              format={"##/##"}
              required
              status={errors["expiryDate"] ? "error" : "default"}
              inputMode={"numeric"}
              autoComplete={"cc-exp"}
              header="Срок"
              placeholder="12/29"
              value={paymentDetails.expiryDate}
              onChange={handleChange("expiryDate")}
            />

            <PatternFormat
              customInput={Input}
              format={"###"}
              required
              status={errors["cvc"] ? "error" : "default"}
              type={isCVCVisible ? "text" : "password"}
              inputMode={"numeric"}
              autoComplete={"off"}
              header="cvc"
              after={
                <IconButton size={"s"} onClick={handleTogglePassword}>
                  {isCVCVisible ? <IconEyeOpened /> : <IconEyeClosed />}
                </IconButton>
              }
              placeholder="123"
              value={paymentDetails.cvc}
              onChange={handleChange("cvc")}
            />
          </div>
        </Section>
        <Section footer="Telegram не имеет доступа к твоей карте. Все данные передаются напрямую в YooKassa">
          <Cell
            Component="label"
            after={
              <Switch
                defaultChecked
                onChange={handleSavePaymentDetails}
                checked={save_payment_method}
              />
            }
            multiline
          >
            Сохранить карту
          </Cell>
        </Section>
      </List>
      {tokenError && (
        <Snackbar
          children={tokenError}
          duration={5000}
          onClose={() => setTokenError(null)}
        />
      )}
    </Page>
  );
});
