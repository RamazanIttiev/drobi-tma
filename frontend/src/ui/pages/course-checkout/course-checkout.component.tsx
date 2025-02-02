import { Page } from "@/ui/organisms/page/page.tsx";
import {
  Button,
  Caption,
  List,
  Section,
  Text,
} from "@telegram-apps/telegram-ui";

import { CourseConfig } from "@/ui/pages/course/course.model.ts";

import "./course-checkout.css";

export interface CourseCheckoutComponentProps {
  title: string;
  price: number;
  config: CourseConfig;
  paymentDataLabel?: string;
  personalDetailsLabel: string;
  isPaymentDataSectionShown: boolean;
  openModal?: () => void;
  navigateToPersonalData: () => void;
  handleSubmit: () => Promise<void>;
}

export const CourseCheckoutComponent = (
  props: CourseCheckoutComponentProps,
) => {
  const {
    title,
    price,
    config,
    paymentDataLabel,
    personalDetailsLabel,
    isPaymentDataSectionShown,
    navigateToPersonalData,
    openModal,
    handleSubmit,
  } = props;

  return (
    <Page horizontalPaddingDisabled verticalPaddingDisabled>
      <List>
        <Section header="Проверь свой выбор">
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Курс</Caption>
            <Text>{title}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Уровень</Caption>
            <Text>{config?.level}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Количество уроков</Caption>
            <Text>{config?.quantity}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Длительность урока</Caption>
            <Text>{config?.duration}</Text>
          </div>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Тип</Caption>
            <Text>{config?.type}</Text>
          </div>
        </Section>

        <Section>
          <div className={"checkout__cell"}>
            <Caption className={"checkout__hint"}>Всего</Caption>
            <Text>{price} ₽</Text>
          </div>
        </Section>

        <Section>
          <button
            className={"checkout__cell checkout__cell_button"}
            onClick={navigateToPersonalData}
          >
            <Text>ФИО</Text>
            <Text className={"checkout__hint"}>
              <Caption className={"checkout__personal-data"}>
                {personalDetailsLabel}
              </Caption>
            </Text>
          </button>
        </Section>

        {isPaymentDataSectionShown && (
          <Section>
            <button
              className={"checkout__cell checkout__cell_button"}
              onClick={openModal}
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
        {import.meta.env.MODE === "development" && (
          <Button onClick={handleSubmit} stretched>
            Оплатить
          </Button>
        )}
      </List>
    </Page>
  );
};
