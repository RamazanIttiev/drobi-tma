import { Page } from "@/ui/organisms/page/page.tsx";
import { Caption, List, Section, Text } from "@telegram-apps/telegram-ui";
import { useLocation, useNavigate } from "react-router-dom";
import { CourseConfig } from "@/ui/pages/course/course.model.ts";

import { TokenResponse } from "@/services/payments/yookassa-payment-token.model.ts";
import { getYooKassaPayload } from "@/services/payments/get-yookassa-payload.ts";
import { createPayment } from "@/services/payments/createPayment.ts";

import "./checkout.css";

interface CourseCheckoutState {
  title: string;
  price: number;
  config: CourseConfig;
  paymentData: {
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    cardHolder: string;
  };
}

const checkoutYooKassa = window.YooMoneyCheckout(
  import.meta.env.VITE_YOOKASSA_SHOP_ID,
  {
    language: "ru",
  },
);

export const CourseCheckoutPage = () => {
  const location = useLocation();
  const state = location.state as CourseCheckoutState;
  const navigate = useNavigate();

  const { title, price, config, paymentData } = state;

  const { selectedDuration, selectedQuantity, selectedType, selectedLevel } =
    config;

  const expMonth = paymentData?.expiryDate?.slice(0, 2);
  const expYear = paymentData?.expiryDate?.slice(3, 5);

  const handlePayment = () =>
    checkoutYooKassa
      .tokenize({
        number: paymentData?.cardNumber,
        cvc: paymentData?.cvc,
        month: expMonth,
        year: expYear,
      })
      .then(async (res: TokenResponse) => {
        if (res.status === "success") {
          const { paymentToken } = res.data.response;

          const payload = getYooKassaPayload({
            payment_token: paymentToken,
            description: "",
            amount: "10000",
            merchant_customer_id: "",
          });

          return createPayment(payload);

          // if (payment.confirmation.confirmation_url) {
          //   window.location.replace(payment.confirmation.confirmation_url);
          // }
        }
      });

  const navigateToPayment = () => {
    navigate("/payment-details", {
      state: {
        from: location.pathname,
        checkoutState: location.state,
      },
    });
  };

  const getLatNumbers = () => {
    if (!paymentData?.cardNumber) return "*4242";

    return (
      <Caption className={"checkout__cardNumber"}>
        {`**** ${paymentData.cardNumber.slice(-4)}`}
      </Caption>
    );
  };

  return (
    <Page horizontalPaddingDisabled verticalPaddingDisabled>
      <List>
        <Section header="Проверь свой выбор">
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Курс</Caption>
            <Text>{title}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Уровень</Caption>
            <Text>{selectedLevel}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Количество уроков</Caption>
            <Text>{selectedQuantity}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Длительность урока</Caption>
            <Text>{selectedDuration}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Тип</Caption>
            <Text>{selectedType}</Text>
          </div>
        </Section>

        <Section>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Всего</Caption>
            <Text>{price} ₽</Text>
          </div>
        </Section>

        <Section>
          <button
            className={"checkout__cell checkout__cell_button"}
            onClick={navigateToPayment}
          >
            <Text>Оплата</Text>
            <Text className={"checkout__hint"}>{getLatNumbers()}</Text>
          </button>
        </Section>
      </List>
    </Page>
  );
};
