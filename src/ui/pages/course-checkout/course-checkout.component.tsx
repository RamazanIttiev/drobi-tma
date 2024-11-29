import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { Page } from "@/ui/organisms/page/page.tsx";
import { Caption, List, Section, Text } from "@telegram-apps/telegram-ui";
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

import {
  AvailablePaymentData,
  getPaymentPayload,
} from "@/ui/pages/payment/payment.model.ts";

import { CardSelectModalComponent } from "@/ui/organisms/card-select-model/card-select-modal.component.tsx";

import "./course-checkout.css";
import { useCloudStorage } from "@/hooks/use-cloud-storage.ts";
import { CloudStorageKeys } from "@/common/models.ts";

export interface CheckoutPageState {
  title: string;
  price: number;
  config: CourseConfig;
}

export const CourseCheckoutPage = memo(() => {
  const location = useLocation();
  const state = location.state as CheckoutPageState;
  const navigate = useNavigate();

  const { getKeys, getItem, deleteItem } = useCloudStorage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availablePaymentData, setAvailablePaymentData] = useState<
    AvailablePaymentData[] | undefined
  >(undefined);
  const [selectedPaymentData, setSelectedPaymentData] = useState<
    AvailablePaymentData | undefined
  >();

  const vm = useCourseCheckoutViewModel();

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
        console.log("Payment succeeded");
      }
    } else {
      navigateToPayment();
    }
  }, [
    availablePaymentData,
    navigateToPayment,
    selectedPaymentData?.id,
    state.price,
    state.title,
    vm,
  ]);

  useEffect(() => {
    mountMainButton();
    setMainButtonParams({
      isVisible: true,
      text: mainButtonText,
    });

    return () => {
      setMainButtonParams({
        isVisible: false,
      });
    };
  }, [mainButtonText]);

  useEffect(() => {
    onMainButtonClick(handleMainButtonClick);

    return () => {
      mainButton.offClick(handleMainButtonClick);
    };
  }, [handleMainButtonClick]);

  useEffect(() => {
    mountSecondaryButton();
    setSecondaryButtonParams({
      isVisible: true,
      text: "Cloud",
    });

    onSecondaryButtonClick(
      async () =>
        await getKeys()?.then(async (res) => {
          await getItem(res).then((items) => {
            if (items) {
              Object.keys(items).forEach((key) => {
                deleteItem(key as CloudStorageKeys);
              });
            }
          });
        }),
    );
  }, [deleteItem, getItem, getKeys]);

  useEffect(() => {
    getKeys()?.then((res) => {
      getItem(res).then((items) => {
        console.log("cloud", items);
      });
    });
  }, [getItem, getKeys]);

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
