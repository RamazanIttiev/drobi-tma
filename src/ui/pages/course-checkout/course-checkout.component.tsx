import { useCallback, useEffect, useMemo, useState } from "react";

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

import {
  AvailablePaymentData,
  getPaymentPayload,
} from "@/ui/pages/payment/payment.model.ts";
import { Payment } from "@a2seven/yoo-checkout";

import "./course-checkout.css";
import { CardSelectModalComponent } from "@/ui/organisms/card-select-model/card-select-modal.component.tsx";
import { usePayment } from "@/context/payment-data.context.tsx";
import { useCloudStorage } from "@/hooks/use-cloud-storage.ts";
import { CloudStorageKeys } from "@/common/models.ts";

export interface CheckoutPageState {
  title: string;
  price: number;
  config: CourseConfig;
}

export const CourseCheckoutPage = () => {
  const location = useLocation();
  const state = location.state as CheckoutPageState;
  const navigate = useNavigate();
  const { save_payment_method } = usePayment();
  const { getItem, getKeys, deleteItem } = useCloudStorage();

  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availablePaymentData, setAvailablePaymentData] = useState<
    AvailablePaymentData[] | undefined
  >(undefined);
  const [selectedPaymentData, setSelectedPaymentData] = useState<
    AvailablePaymentData | undefined
  >(undefined);

  const rawVm = useCourseCheckoutViewModel();
  const vm = useMemo(() => rawVm, [rawVm]);

  const navigateToPayment = async () => {
    if (availablePaymentData) {
      setIsModalOpen(true);
    } else {
      navigate("/payment-details");
    }
  };

  const successfulPayment = useCallback(
    async (response: Payment | undefined) => {
      if (response?.status === "succeeded") {
        const lastDigits = response.payment_method.card?.last4;

        if (lastDigits) {
          const paymentData = {
            id: response.id,
            label: lastDigits,
          };

          await vm.setPaymentData(paymentData);
          await vm.setSelectedPaymentData(paymentData);
        }
      }
    },
    [vm],
  );

  const handleSubmit = useCallback(async () => {
    try {
      const payment_token = await vm.getPaymentToken();
      const selectedPaymentData = await vm.getSelectedPaymentData();

      if (!payment_token && !selectedPaymentData) {
        setError("Ошибка при создании платежа. Добавьте способ оплаты");
        return;
      }

      const payload = getPaymentPayload({
        payment_token,
        payment_method_id: selectedPaymentData?.id,
        description: "",
        amount: state.price.toString(),
        merchant_customer_id: "",
        save_payment_method,
      });

      const response = await vm.createPayment(payload);
      await successfulPayment(response);
    } catch (error: unknown) {
      console.log(error);
      setError("Ошибка при создании платежа. Добавьте способ оплаты");
    } finally {
      await vm.deletePaymentToken();
    }
  }, [save_payment_method, state.price, successfulPayment, vm]);

  const paymentDataLabel = useMemo(
    () =>
      selectedPaymentData
        ? `**** ${selectedPaymentData?.label}`
        : "Добавить карту",
    [selectedPaymentData],
  );

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
  }, [handleSubmit]);

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
    const fetchPaymentData = async () => {
      const data = await vm.getPaymentData();
      setAvailablePaymentData(data);
    };

    fetchPaymentData();
  }, []);

  useEffect(() => {
    const fetchPaymentData = async () => {
      const data = await vm.getSelectedPaymentData();
      setSelectedPaymentData(data);
    };

    fetchPaymentData();
  }, []);

  useEffect(() => {
    getKeys()?.then((res) => {
      getItem(res).then((items) => {
        console.log("cloud", items);
      });
    });
  }, [getItem, getKeys]);

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
              <Caption className={"checkout__cardNumber"}>
                {paymentDataLabel}
              </Caption>
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
        options={availablePaymentData}
      />
    </Page>
  );
};
