import { Page } from "@/ui/organisms/page/page.tsx";
import { Caption, List, Section, Text } from "@telegram-apps/telegram-ui";
import { useLocation, useNavigate } from "react-router-dom";
import { usePayment } from "@/context/payment-data.context.tsx";

import { CourseConfig } from "@/ui/pages/course/course.model.ts";

import "./checkout.css";

export interface CheckoutPageState {
  title: string;
  price: number;
  config: CourseConfig;
}

// const payload = getYooKassaPayload({
//   payment_token: paymentToken,
//   description: "",
//   amount: "10000",
//   merchant_customer_id: "",
// });

export const CourseCheckoutPage = () => {
  const location = useLocation();
  const state = location.state as CheckoutPageState;
  const navigate = useNavigate();
  const { paymentData } = usePayment();

  const { title, price, config } = state;

  const navigateToPayment = () => {
    navigate("/payment-details");
  };

  const getLatNumbers = () => {
    if (!paymentData?.cardNumber) return;

    return (
      <Caption className={"checkout__cardNumber"}>
        {`**** ${paymentData?.cardNumber.slice(-4)}`}
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
            <Text>{config?.selectedLevel}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Количество уроков</Caption>
            <Text>{config?.selectedQuantity}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Длительность урока</Caption>
            <Text>{config?.selectedDuration}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Тип</Caption>
            <Text>{config?.selectedType}</Text>
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
