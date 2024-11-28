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

import "./card-select-modal.css";
import { AvailablePaymentData } from "@/ui/pages/payment/payment.model.ts";

interface CardSelectModalComponentProps {
  isOpen: boolean;
  onChange: (value: boolean) => void;
  options: AvailablePaymentData[] | undefined;
}

export const CardSelectModalComponent = (
  props: CardSelectModalComponentProps,
) => {
  const { isOpen, options, onChange } = props;
  console.log(options);
  return (
    <Modal
      closeThreshold={0.5}
      modal
      header={<ModalHeader>Выберите способ оплаты</ModalHeader>}
      open={isOpen}
      onOpenChange={(value) => onChange(value)}
    >
      <Section
        className={"cardSelectModal__section"}
        footer={"Тут отображаются сохраненные карты после совершенного платежа"}
      >
        <form>
          {options
            ? options.map((option) => (
                <Cell
                  Component="label"
                  before={<Selectable defaultChecked name="group" value={1} />}
                  multiline
                >
                  {option.label}
                </Cell>
              ))
            : null}
          <Divider />
          <Link to={"/payment-details"} className={"cardSelectModal__link"}>
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
