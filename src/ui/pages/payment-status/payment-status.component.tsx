import { IPaymentStatus } from "@a2seven/yoo-checkout";
import { Page } from "@/ui/organisms/page/page.tsx";
import Lottie from "lottie-react";
import { Spinner, Text } from "@telegram-apps/telegram-ui";

import duckLike from "@/assets/lottie/duck_like.json";
import duckSad from "@/assets/lottie/duck_sad.json";

import "./payment-status.css";

interface PaymentStatusComponentProps {
  status: IPaymentStatus | undefined;
}

export const PaymentStatusComponent = (props: PaymentStatusComponentProps) => {
  const { status } = props;

  const getContent = () => {
    switch (status) {
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
