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

import { CourseConfig } from "@/ui/pages/course/course.model.ts";

import { useCourseCheckoutViewModel } from "@/ui/pages/course-checkout/course-checkout-view-model.ts";
import {
  mainButton,
  mountMainButton,
  mountSecondaryButton,
  onMainButtonClick,
  onSecondaryButtonClick,
  setMainButtonParams,
  setSecondaryButtonParams,
} from "@telegram-apps/sdk-react";

import { getPaymentPayload } from "@/ui/pages/payment/payment.model.ts";
import { Payment } from "@a2seven/yoo-checkout";
import { useCloudStorage } from "@/hooks/use-cloud-storage.ts";

import "./course-checkout.css";
import { CardSelectModalComponent } from "@/ui/organisms/card-select-model/card-select-modal.component.tsx";

export interface CheckoutPageState {
  title: string;
  price: number;
  config: CourseConfig;
}

export const CourseCheckoutPage = () => {
  const location = useLocation();
  const state = location.state as CheckoutPageState;
  const navigate = useNavigate();
  const cloud = useCloudStorage();

  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastDigits, setLastDigits] = useState<string | undefined>(undefined);

  const vm = useCourseCheckoutViewModel();

  const navigateToPayment = async () => {
    if (await vm.getPaymentMethodId()) {
      setIsModalOpen(true);
    } else {
      navigate("/payment-details");
    }
  };

  const successfulPayment = useCallback(
    async (response: Payment | undefined) => {
      if (response?.status === "succeeded") {
        if (response.id) {
          await vm.setPaymentMethodIdToStorage(response.id);

          const last4 = response.payment_method.card?.last4;
          if (last4) {
            await vm.setLastDigitsToStorage(last4);
          }
        }
      }
    },
    [vm],
  );

  const handleSubmit = useCallback(async () => {
    try {
      const payment_token = await vm.getPaymentToken();
      const payment_method_id = await vm.getPaymentMethodId();

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
      await successfulPayment(response);
    } catch (error) {
      setError("Ошибка при создании платежа. Добавьте способ оплаты");
    } finally {
      await vm.deletePaymentToken();
    }
  }, [state.price, successfulPayment, vm]);

  useEffect(() => {
    mountMainButton();
    mountSecondaryButton();
    setMainButtonParams({
      isVisible: true,
      text: "Оплатить",
    });

    cloud
      .getItem(["payment_token", "last_digits", "payment_method_id"])
      ?.then((res) => console.log("cloud", res));
    setSecondaryButtonParams({
      isVisible: true,
      text: "Delete",
    });

    onSecondaryButtonClick(async () => {
      await vm.deletePaymentToken();
    });

    onMainButtonClick(handleSubmit);

    return () => {
      setMainButtonParams({
        isVisible: false,
      });
      mainButton.offClick(handleSubmit);
    };
  }, [cloud, handleSubmit, vm]);

  useEffect(() => {
    const init = async () => {
      if ((await vm.getPaymentMethodId()) === "") setLastDigits(undefined);

      setLastDigits(await vm.getLastDigits());
    };

    init();
  }, [vm]);

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
            <Text className={"checkout__hint"}>
              <Caption
                className={"checkout__cardNumber"}
              >{`**** ${lastDigits}`}</Caption>
            </Text>
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
      <CardSelectModalComponent
        isOpen={isModalOpen}
        onChange={setIsModalOpen}
      />
    </Page>
  );
};
