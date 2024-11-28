import React, { useCallback, useEffect, useState } from "react";
import { Page } from "@/ui/organisms/page/page";
import {
  Button,
  Cell,
  IconButton,
  Input,
  List,
  Section,
  Switch,
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

  const {
    paymentDetails,
    save_payment_method,
    setPaymentDetails,
    setPaymentToken,
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

  const submitPaymentDetails = useCallback(async () => {
    const payment_token = await vm.fetchPaymentToken(paymentDetails);

    if (isTokenResponseSuccessful(payment_token)) {
      setPaymentToken(payment_token);
      await vm.setPaymentToken(payment_token);

      navigate(-1);
    } else {
      const fieldErrors = mapErrorsToFields(payment_token);

      setErrors(fieldErrors);
    }
  }, [navigate, paymentDetails, setPaymentToken, vm]);

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

    onMainButtonClick(submitPaymentDetails);

    return () => {
      setMainButtonParams({
        isVisible: false,
      });
      mainButton.offClick(submitPaymentDetails);
    };
  }, [submitPaymentDetails]);

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
                <IconButton onClick={handleTogglePassword}>
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
      <Button onClick={handleSavePaymentDetails} stretched>
        Сохранить
      </Button>
    </Page>
  );
};
