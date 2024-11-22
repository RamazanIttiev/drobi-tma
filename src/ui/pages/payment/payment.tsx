import { useCallback, useState } from "react";
import { Page } from "@/ui/organisms/page/page";
import { Button, IconButton, Input, Section } from "@telegram-apps/telegram-ui";
import { useLocation, useNavigate } from "react-router-dom";
import { PatternFormat } from "react-number-format";

import IconEyeOpened from "@/assets/icons/eye-opened.svg";
import IconEyeClosed from "@/assets/icons/eye-closed.svg";

import "./payment.css";

interface PaymentDetailsState {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardHolder: string;
}

export const PaymentDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isCVCVisible, setIsCVCVisible] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentDetailsState>({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    cardHolder: "",
  });

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setPaymentData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = useCallback(() => {
    return navigate(state.from, {
      state: {
        ...state.checkoutState,
        paymentData,
      },
    });
  }, [navigate, state.from, state.checkoutState, paymentData]);

  const handleTogglePassword = useCallback(() => {
    setIsCVCVisible((prev) => !prev);
  }, []);

  return (
    <Page verticalPaddingDisabled horizontalPaddingDisabled>
      <Section header="Данные карты">
        <PatternFormat
          customInput={Input}
          format={"#### #### #### ####"}
          required
          inputMode={"numeric"}
          autoComplete={"cc-number"}
          header="Номер карты"
          placeholder="1234 5678 1234 5678"
          value={paymentData.cardNumber}
          onChange={handleChange("cardNumber")}
        />

        <div className={"payment__exp-cvc"}>
          <PatternFormat
            customInput={Input}
            format={"##/##"}
            required
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
      <Section footer="Telegram не имеет доступа к твоей карте. Все данные передаются напрямую в YooKassa">
        <Input
          header="Имя на карте"
          autoComplete={"cc-name"}
          placeholder="Держатель карты"
          value={paymentData.cardHolder}
          onChange={handleChange("cardHolder")}
        />
      </Section>
      <Button onClick={handleSubmit} stretched>
        Сохранить
      </Button>
    </Page>
  );
};
