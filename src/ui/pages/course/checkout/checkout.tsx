import { Page } from "@/ui/organisms/page/page.tsx";
import { Caption, List, Section, Text } from "@telegram-apps/telegram-ui";
import { useLocation } from "react-router-dom";
import { CourseConfig } from "@/ui/pages/course/course.model.ts";

import "./checkout.css";
import { TokenResponse } from "@/services/payments/yookassa-payment-token.model.ts";
import { getYooKassaPayload } from "@/services/payments/get-yookassa-payload.ts";
import { createPayment } from "@/services/payments/createPayment.ts";

interface CourseCheckoutState {
  title: string;
  price: number;
  config: CourseConfig;
}

const checkoutYooKassa = window.YooMoneyCheckout(
  import.meta.env.VITE_YOOKASSA_SHOP_ID,
  {
    language: "ru",
  },
);

export const CourseCheckoutPage = () => {
  const location = useLocation();
  const course = location.state as CourseCheckoutState;

  const { title, price, config } = course;
  const { selectedDuration, selectedQuantity, selectedType, selectedLevel } =
    config;

  const handlePayment = () =>
    checkoutYooKassa
      .tokenize({
        number: "5555555555577",
        cvc: "122",
        month: "12",
        year: "24",
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

  return (
    <Page>
      <List>
        <Section header="Проверь свой выбор">
          <div className={"checkout__cell"}>
            <Caption className={"checkout__caption"}>Курс</Caption>
            <Text>{title}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__caption"}>Уровень</Caption>
            <Text>{selectedLevel}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__caption"}>Количество уроков</Caption>
            <Text>{selectedQuantity}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__caption"}>
              Длительность урока
            </Caption>
            <Text>{selectedDuration}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__caption"}>Тип</Caption>
            <Text>{selectedType}</Text>
          </div>
        </Section>
        <Section>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__caption"}>Всего</Caption>
            <Text>{price} ₽</Text>
          </div>
        </Section>
      </List>
    </Page>
  );
};
