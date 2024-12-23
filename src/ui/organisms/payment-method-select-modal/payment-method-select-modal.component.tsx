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

import IconCard from "@/assets/icons/card-icon.svg";

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
      header={<ModalHeader>Выберите способ оплаты</ModalHeader>}
      open={isOpen}
      onOpenChange={onChange}
    >
      <Section
        className={"paymentMethodSelectModal__section"}
        footer={"Тут отображаются сохраненные карты после совершенного платежа"}
      >
        <form>
          {options?.map((option) => {
            return (
              <Cell
                key={option.id}
                Component="label"
                before={
                  <Selectable
                    checked={selectedOption?.id === option.id}
                    name="group"
                    value={option.id}
                    onChange={() => onOptionSelect(option)}
                  />
                }
                multiline
              >
                {option.paymentMethodType === "sberbank"
                  ? "SberPay"
                  : `${option.first6} ** **** ${option.last4}`}
              </Cell>
            );
          })}
          <Divider />
          <Link
            to={"/payment-details"}
            state={state}
            className={"paymentMethodSelectModal__link"}
          >
            <Cell Component="label" before={<IconCard />}>
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
