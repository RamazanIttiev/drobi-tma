import React, { useCallback, useEffect, useState } from "react";
import { Page } from "@/ui/organisms/page/page";
import {
  Button,
  IconButton,
  Input,
  List,
  Section,
} from "@telegram-apps/telegram-ui";
import { useNavigate } from "react-router-dom";
import { usePayment } from "@/context/payment-data.context.tsx";
import { PatternFormat } from "react-number-format";
import {
  mainButton,
  mountMainButton,
  onMainButtonClick,
  setMainButtonParams,
} from "@telegram-apps/sdk-react";
import {
  FieldErrors,
  isTokenResponseSuccessful,
  mapErrorsToFields,
} from "@/ui/pages/payment/payment.model.ts";
import { usePaymentViewModel } from "@/ui/pages/payment/payment-view-model.ts";

import IconEyeOpened from "@/assets/icons/eye-opened.svg";
import IconEyeClosed from "@/assets/icons/eye-closed.svg";
import IconCard from "@/assets/icons/card-icon.svg";

import "./payment.css";

export const PaymentPage = () => {
  const navigate = useNavigate();
  const [isCVCVisible, setIsCVCVisible] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const vm = usePaymentViewModel();

  const { paymentData, setPaymentData, setPaymentToken } = usePayment();

  const handleChange =
    (field: keyof typeof paymentData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setPaymentData({
        ...paymentData,
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

  const submitPaymentData = useCallback(async () => {
    const payment_token = await vm.fetchPaymentToken(paymentData);

    if (isTokenResponseSuccessful(payment_token)) {
      setPaymentToken(payment_token);
      await vm.setPaymentTokenToStorage(payment_token);

      navigate(-1);
    } else {
      const fieldErrors = mapErrorsToFields(payment_token);

      setErrors(fieldErrors);
    }
  }, [navigate, paymentData, setPaymentToken, vm]);

  useEffect(() => {
    mountMainButton();
    setMainButtonParams({
      backgroundColor: "#000000",
      isVisible: true,
      text: `Сохранить`,
      textColor: "#ffffff",
    });

    onMainButtonClick(submitPaymentData);

    return () => {
      setMainButtonParams({
        isVisible: false,
      });
      mainButton.offClick(submitPaymentData);
    };
  }, [submitPaymentData]);

  return (
    <Page verticalPaddingDisabled horizontalPaddingDisabled>
      <List>
        <Section
          header="Данные карты"
          footer="Telegram не имеет доступа к твоей карте. Все данные передаются напрямую в YooKassa"
        >
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
            value={paymentData.cardNumber}
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
              value={paymentData.expiryDate}
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
                <IconButton onClick={handleTogglePassword}>
                  {isCVCVisible ? <IconEyeOpened /> : <IconEyeClosed />}
                </IconButton>
              }
              placeholder="123"
              value={paymentData.cvc}
              onChange={handleChange("cvc")}
            />
          </div>
        </Section>
      </List>
      <Button onClick={submitPaymentData} stretched>
        Сохранить
      </Button>
    </Page>
  );
};
