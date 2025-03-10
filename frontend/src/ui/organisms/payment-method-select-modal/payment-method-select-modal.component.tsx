import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import {
  Caption,
  Cell,
  Divider,
  Modal,
  Section,
  Selectable,
} from "@telegram-apps/telegram-ui";
import { Link } from "react-router-dom";
import { ModalOverlay } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalOverlay/ModalOverlay";
import { Icon28AddCircle } from "@telegram-apps/telegram-ui/dist/icons/28/add_circle";

import IconCard from "@/assets/icons/card-icon.svg";
import IconSberbank from "@/assets/icons/icon-sberbank.svg";

import { AvailablePaymentData } from "@/ui/pages/payment/payment.model.ts";
import { CheckoutPageState } from "@/ui/pages/course-checkout/course-checkout.container.tsx";

import "./payment-method-select-modal.css";

interface PaymentMethodSelectModalComponentProps {
  state: CheckoutPageState;
  isOpen: boolean;
  onChange: (isOpen: boolean) => void;
  options: AvailablePaymentData[] | undefined;
  selectedOption: AvailablePaymentData | undefined;
  onOptionSelect: (value: AvailablePaymentData) => void;
}

const getLabel = (paymentMethodType: string) => {
  switch (paymentMethodType) {
    case "bank_card":
      return "Банковская карта";
    case "sberbank":
      return "SberPay";
    default:
      return "";
  }
};

export const PaymentMethodSelectModalComponent = ({
  state,
  isOpen,
  options,
  onChange,
  selectedOption,
  onOptionSelect,
}: PaymentMethodSelectModalComponentProps) => {
  return (
    <Modal
      closeThreshold={0.5}
      modal
      header={
        <ModalHeader className={"paymentMethodSelectModal__header"}>
          Выберите способ оплаты
        </ModalHeader>
      }
      overlayComponent={
        <ModalOverlay className={"paymentMethodSelectModal__overlay"} />
      }
      open={isOpen}
      onOpenChange={onChange}
      className={"paymentMethodSelectModal"}
    >
      <Section className={"paymentMethodSelectModal__section"}>
        <form>
          {options?.map((option) => {
            return (
              <>
                <Cell
                  key={option.id}
                  Component="label"
                  before={
                    option.paymentMethodType !== "sberbank" ? (
                      <IconCard />
                    ) : (
                      <IconSberbank />
                    )
                  }
                  after={
                    <Selectable
                      checked={selectedOption?.id === option.id}
                      name="group"
                      value={option.id}
                      onChange={() => onOptionSelect(option)}
                    />
                  }
                  multiline
                >
                  {getLabel(option.paymentMethodType)}
                </Cell>
                <Divider />
              </>
            );
          })}
          <Divider />
          <Link
            to={"/payment-details"}
            state={state}
            className={"paymentMethodSelectModal__link"}
          >
            <Cell Component="label" before={<Icon28AddCircle />}>
              <Caption className={"paymentMethodSelectModal__caption"}>
                Добавить новую карту
              </Caption>
            </Cell>
          </Link>
        </form>
      </Section>
    </Modal>
  );
};
