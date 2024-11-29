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
import { CheckoutPageState } from "@/ui/pages/course-checkout/course-checkout.component.tsx";

import "./card-select-modal.css";

interface CardSelectModalComponentProps {
  state: CheckoutPageState;
  isOpen: boolean;
  onChange: (isOpen: boolean) => void;
  options: AvailablePaymentData[] | undefined;
  selectedOption: AvailablePaymentData | undefined;
  onOptionSelect: (value: AvailablePaymentData) => void;
}

export const CardSelectModalComponent = ({
  state,
  isOpen,
  options,
  onChange,
  selectedOption,
  onOptionSelect,
}: CardSelectModalComponentProps) => {
  return (
    <Modal
      closeThreshold={0.5}
      modal
      header={<ModalHeader>Выберите способ оплаты</ModalHeader>}
      open={isOpen}
      onOpenChange={onChange}
    >
      <Section
        className={"cardSelectModal__section"}
        footer={"Тут отображаются сохраненные карты после совершенного платежа"}
      >
        <form>
          {options ? (
            options.map((option) => {
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
                  {`${option.first6} ** **** ${option.last4}`}
                </Cell>
              );
            })
          ) : (
            <Caption className="cardSelectModal__empty">
              Нет сохраненных карт
            </Caption>
          )}
          <Divider />
          <Link
            to={"/payment-details"}
            state={state}
            className={"cardSelectModal__link"}
          >
            <Cell Component="label" before={<IconCard />}>
              <Caption className={"cardSelectModal__caption"}>
                Добавить новую карту
              </Caption>
            </Cell>
          </Link>
        </form>
      </Section>
    </Modal>
  );
};
