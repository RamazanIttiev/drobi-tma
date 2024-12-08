import { useCallback, useEffect, useState } from "react";
import { AvailablePaymentData } from "@/ui/pages/payment/payment.model.ts";
import { Payment } from "@a2seven/yoo-checkout";
import { Page } from "@/ui/organisms/page/page.tsx";
import Lottie from "lottie-react";
import { Spinner, Text } from "@telegram-apps/telegram-ui";

import { useNavigate } from "react-router-dom";
import { useMainButton } from "@/hooks/use-main-button.ts";
import { usePaymentViewModel } from "@/ui/pages/payment/payment-view-model.ts";

import duckLike from "@/assets/lottie/duck_like.json";
import duckSad from "@/assets/lottie/duck_sad.json";

import "./payment-status.css";

export const PaymentStatusPage = () => {
  const vm = usePaymentViewModel();
  const navigate = useNavigate();

  const [payment, setPayment] = useState<Payment | undefined>(undefined);

  const setPaymentData = useCallback(
    async (response: Payment) => {
      const last4 = response.payment_method.card?.last4;
      const first6 = response.payment_method.card?.first6;
      const type = response.payment_method.card?.card_type;

      if (!last4 || !first6 || !type) {
        return;
      }

      setPayment(response);

      const paymentData: AvailablePaymentData = {
        id: response.id,
        last4,
        first6,
        type,
      };

      await vm.addPaymentData(paymentData);
    },
    [vm],
  );

  useEffect(() => {
    const fetchPaymentData = async () => {
      const pendingPayment = await vm.getPendingPayment();

      try {
        if (pendingPayment?.id) {
          const payment = await vm.getPayment(pendingPayment.id);

          if (payment?.status === "succeeded") {
            await setPaymentData(payment);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        await vm.deletePendingPayment();
      }
    };

    fetchPaymentData().catch(console.error);
  }, [setPaymentData, vm]);

  useMainButton({ onClick: () => navigate("/"), text: "Домой" });

  const getContent = () => {
    switch (payment?.status) {
      case "succeeded": {
        return (
          <>
            <Lottie
              animationData={duckLike}
              loop={true}
              className={"payment-status__lottie"}
            />
            <Text>Ваш платеж прошел успешно 🎉</Text>
          </>
        );
      }
      case "pending": {
        return (
          <>
            <Lottie
              animationData={duckSad}
              loop={true}
              className={"payment-status__lottie"}
            />
            <Text className={"payment-status__text"}>
              С оплатой пошло что то не так. Пожалуйста попробуйте заново 🥲
            </Text>
          </>
        );
      }
      default: {
        return <Spinner size="m" />;
      }
    }
  };
  return (
    <Page fixed className={"payment-status"}>
      {getContent()}
    </Page>
  );
};
