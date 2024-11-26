import { useCallback, useEffect, useState } from "react";

import { Page } from "@/ui/organisms/page/page.tsx";
import {
  Caption,
  List,
  Section,
  Snackbar,
  Text,
} from "@telegram-apps/telegram-ui";
import { useLocation, useNavigate } from "react-router-dom";
import { usePayment } from "@/context/payment-data.context.tsx";

import { CourseConfig } from "@/ui/pages/course/course.model.ts";

import { useCourseCheckoutViewModel } from "@/ui/pages/course-checkout/course-checkout-view-model.ts";
import {
  mainButton,
  mountMainButton,
  onMainButtonClick,
  setMainButtonParams,
} from "@telegram-apps/sdk-react";

import "./course-checkout.css";
import { getPaymentPayload } from "@/ui/pages/payment/payment.model.ts";
import { Payment } from "@a2seven/yoo-checkout";

export interface CheckoutPageState {
  title: string;
  price: number;
  config: CourseConfig;
}

export const CourseCheckoutPage = () => {
  const location = useLocation();
  const state = location.state as CheckoutPageState;
  const navigate = useNavigate();
  const { paymentData } = usePayment();

  const [error, setError] = useState<string | null>(null);

  const vm = useCourseCheckoutViewModel();

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

  const successfullPayment = async (
    response: { data: Payment } | undefined,
  ) => {
    if (response?.data.status === "succeeded") {
      if (response.data.id) {
        await vm.setPaymentMethodIdToStorage(response.data.payment_method_id);

        const last4 = response.data.payment_method.card?.last4;
        if (last4) {
          await vm.setLastDigitsToStorage(last4);
        }
      }
    }
  };

  const handleSubmit = useCallback(async () => {
    try {
      const payment_token = await vm.getPaymentMethodIdFromStorage();
      const payment_method_id = await vm.getPaymentTokenFromStorage();

      if (!payment_token && !payment_method_id) {
        setError("Ошибка при создании платежа. Добавьте способ оплаты");
        return;
      }

      const buildPayload = () => {
        const payload = getPaymentPayload({
          payment_token,
          payment_method_id,
          description: "",
          amount: state.price.toString(),
          merchant_customer_id: "",
          save_payment_method: true,
        });

        if (payment_token && !payment_method_id) {
          const { payment_method_id, ...initialPayment } = payload;
          return initialPayment;
        } else {
          const { payment_token, ...savedPayment } = payload;
          return savedPayment;
        }
      };

      const response = await vm.createPayment(buildPayload());
      await successfullPayment(response);
    } catch (error) {
      setError("Ошибка при создании платежа. Добавьте способ оплаты");
    } finally {
      await vm.deletePaymentTokenFromStorage();
    }
  }, [state.price, successfullPayment, vm]);

  useEffect(() => {
    mountMainButton();
    setMainButtonParams({
      isVisible: true,
      text: "Оплатить",
    });

    onMainButtonClick(handleSubmit);

    return () => {
      setMainButtonParams({
        isVisible: false,
      });
      mainButton.offClick(handleSubmit);
    };
  }, [handleSubmit, vm]);

  return (
    <Page horizontalPaddingDisabled verticalPaddingDisabled>
      <List>
        <Section header="Проверь свой выбор">
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Курс</Caption>
            <Text>{state?.title}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Уровень</Caption>
            <Text>{state?.config?.selectedLevel}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Количество уроков</Caption>
            <Text>{state?.config?.selectedQuantity}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Длительность урока</Caption>
            <Text>{state?.config?.selectedDuration}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Тип</Caption>
            <Text>{state?.config?.selectedType}</Text>
          </div>
        </Section>

        <Section>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Всего</Caption>
            <Text>{state?.price} ₽</Text>
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
        {error && (
          <Snackbar
            children={error}
            duration={5000}
            onClose={() => setError(null)}
          />
        )}
      </List>
    </Page>
  );
};
