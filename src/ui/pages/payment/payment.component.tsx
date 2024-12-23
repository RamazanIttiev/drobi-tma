import { Page } from "@/ui/organisms/page/page";
import {
  Button,
  Cell,
  IconButton,
  List,
  Section,
  Snackbar,
  Switch,
} from "@telegram-apps/telegram-ui";
import { PatternFormat } from "react-number-format";
import { PaymentDetails } from "@/ui/pages/payment/payment.model.ts";
import { FieldErrors } from "@/common/models.ts";
import { Input } from "@/ui/atoms/input/input.component.tsx";
import React from "react";

import IconEyeOpened from "@/assets/icons/eye-opened.svg";
import IconEyeClosed from "@/assets/icons/eye-closed.svg";
import IconCard from "@/assets/icons/card-icon.svg";

import "./payment.css";

interface PaymentPageProps {
  errors: FieldErrors;
  fieldError: string | null;
  paymentDetails: PaymentDetails;
  save_payment_method: boolean;
  isCVCVisible: boolean;
  resetFieldError: () => void;
  handleSubmit: () => Promise<void>;
  handleTogglePassword: () => void;
  handleSavePaymentDetails: () => void;
  handleChange: (
    field: keyof PaymentDetails,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PaymentComponent = (props: PaymentPageProps) => {
  const {
    errors,
    paymentDetails,
    save_payment_method,
    isCVCVisible,
    fieldError,
    handleSubmit,
    handleChange,
    resetFieldError,
    handleTogglePassword,
    handleSavePaymentDetails,
  } = props;

  return (
    <Page verticalPaddingDisabled horizontalPaddingDisabled>
      <List>
        <Section header="Данные карты" className={"payment__section"}>
          <PatternFormat
            customInput={Input}
            className={"payment__input payment__card-number"}
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
              className={"payment__input"}
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
              className={"payment__input"}
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
      {import.meta.env.DEV && (
        <Button stretched onClick={handleSubmit}>
          Оплатить
        </Button>
      )}
      {fieldError && (
        <Snackbar
          children={fieldError}
          duration={5000}
          onClose={resetFieldError}
        />
      )}
    </Page>
  );
};
