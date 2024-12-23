import React from "react";
import { Page } from "@/ui/organisms/page/page";
import {
  Button,
  Cell,
  List,
  Section,
  Switch,
} from "@telegram-apps/telegram-ui";
import { PatternFormat } from "react-number-format";
import { Input } from "@/ui/atoms/input/input.component.tsx";

import { PersonalDetails } from "@/ui/pages/personal-details/personal-details.model.ts";
import { FieldErrors } from "@/common/models.ts";

import "./personal-details.css";

interface PersonalDataPageProps {
  errors?: FieldErrors;
  personalDetails: PersonalDetails | undefined;
  savePersonalDetails?: boolean;
  handleChange: (
    field: keyof PersonalDetails,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSavePersonalDetails: () => void;
  handleSubmit?: () => void;
}

export const PersonalDetailsComponent = (props: PersonalDataPageProps) => {
  const {
    errors,
    personalDetails,
    savePersonalDetails,
    handleChange,
    handleSubmit,
    handleSavePersonalDetails,
  } = props;

  return (
    <Page verticalPaddingDisabled horizontalPaddingDisabled>
      <List>
        <Section header="Личные данные">
          <Input
            required
            status={errors?.["name"] ? "error" : "default"}
            header="Имя и Фамилия"
            placeholder="John Doe"
            value={personalDetails?.name}
            onChange={handleChange("name")}
          />

          <Input
            type="email"
            required
            status={errors?.["email"] ? "error" : "default"}
            header="Email"
            placeholder="example@mail.com"
            value={personalDetails?.email}
            onChange={handleChange("email")}
          />

          <PatternFormat
            customInput={Input}
            format="+7 (###) ###-##-##"
            allowEmptyFormatting
            mask="_"
            required
            status={errors?.["phone"] ? "error" : "default"}
            inputMode={"tel"}
            header="Телефон"
            placeholder="+7 (___) ___-__-__"
            value={personalDetails?.phone}
            onChange={handleChange("phone")}
          />
        </Section>

        <Section footer="Так не придется заполнять их в следующий раз">
          <Cell
            Component="label"
            after={
              <Switch
                defaultChecked
                onChange={handleSavePersonalDetails}
                checked={savePersonalDetails}
              />
            }
            multiline
          >
            Сохранить данные
          </Cell>
        </Section>
        {import.meta.env.DEV && (
          <Button stretched onClick={handleSubmit}>
            Оплатить
          </Button>
        )}
      </List>
    </Page>
  );
};
