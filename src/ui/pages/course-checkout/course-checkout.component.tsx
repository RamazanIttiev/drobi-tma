import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { Page } from "@/ui/organisms/page/page.tsx";
import { Caption, List, Section, Text } from "@telegram-apps/telegram-ui";
import { useLocation, useNavigate } from "react-router-dom";

import { CourseConfig } from "@/ui/pages/course/course.model.ts";

import { setMainButtonParams } from "@telegram-apps/sdk-react";

import {
  AvailablePaymentData,
  getPaymentPayload,
} from "@/ui/pages/payment/payment.model.ts";

import { CardSelectModalComponent } from "@/ui/organisms/card-select-model/card-select-modal.component.tsx";

import { usePaymentViewModel } from "@/ui/pages/payment/payment-view-model.ts";

import "./course-checkout.css";
import { useMainButton } from "@/hooks/use-main-button.ts";

export interface CheckoutPageState {
  title: string;
  price: number;
  config: CourseConfig;
}

export const CourseCheckoutPage = memo(() => {
  const location = useLocation();
  const state = location.state as CheckoutPageState;
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availablePaymentData, setAvailablePaymentData] = useState<
    AvailablePaymentData[] | undefined
  >(undefined);
  const [selectedPaymentData, setSelectedPaymentData] = useState<
    AvailablePaymentData | undefined
  >();

  const vm = usePaymentViewModel();

  const navigateToPayment = useCallback(() => {
    navigate("/payment-details", {
      state,
    });
  }, [navigate, state]);

  const paymentDataLabel = useMemo(() => {
    if (selectedPaymentData) {
      return `**** ${selectedPaymentData.last4}`;
    }
  }, [selectedPaymentData]);

  const mainButtonText = useMemo(
    () => (selectedPaymentData ? "Оплатить" : "К оплате"),
    [selectedPaymentData],
  );

  const handleMainButtonClick = useCallback(async () => {
    setIsLoading(true);
    if (availablePaymentData) {
      setIsModalOpen(false);

      const payload = getPaymentPayload({
        payment_method_id: selectedPaymentData?.id,
        merchant_customer_id: "",
        description: state.title,
        amount: state.price.toString(),
      });

      const response = await vm.createPayment(payload);

      if (response?.status === "succeeded") {
        setIsLoading(false);
        navigate(import.meta.env.VITE_PAYMENT_STATUS_URL);
      }

      if (response?.status === "pending") {
        const confirmation_url = response.confirmation.confirmation_url;

        await vm.setPendingPayment(response);

        setMainButtonParams({
          isVisible: false,
        });

        if (confirmation_url) {
          window.location.href = confirmation_url;
        }
      }
    } else {
      navigateToPayment();
    }
  }, [
    availablePaymentData,
    navigate,
    navigateToPayment,
    selectedPaymentData?.id,
    state.price,
    state.title,
    vm,
  ]);

  useMainButton({
    text: mainButtonText,
    onClick: handleMainButtonClick,
    isLoading,
  });

  useEffect(() => {
    const fetchPaymentData = async () => {
      const data = await vm.getPaymentData();
      setAvailablePaymentData(data);
      setSelectedPaymentData(data?.[0]);
    };

    fetchPaymentData().catch(console.error);
  }, []);

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

        {availablePaymentData && (
          <Section>
            <button
              className={"checkout__cell checkout__cell_button"}
              onClick={() => setIsModalOpen(true)}
            >
              <Text>Оплата</Text>
              <Text className={"checkout__hint"}>
                <Caption className={"checkout__cardNumber"}>
                  {paymentDataLabel}
                </Caption>
              </Text>
            </button>
          </Section>
        )}
      </List>
      <CardSelectModalComponent
        state={state}
        isOpen={isModalOpen}
        onChange={setIsModalOpen}
        options={availablePaymentData}
        selectedOption={selectedPaymentData}
        onOptionSelect={setSelectedPaymentData}
      />
    </Page>
  );
});
