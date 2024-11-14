import { useLoaderData, useNavigate } from "react-router-dom";
import { Page } from "@/ui/organisms/page/page.tsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  invoice,
  mountMainButton,
  onMainButtonClick,
  setMainButtonParams,
} from "@telegram-apps/sdk-react";
import { createInvoiceLink } from "@/services/invoice/invoice.ts";
import { InvoiceBody } from "@/services/invoice/invoice.model.ts";
import {
  calculatePrice,
  Course,
  CourseDuration,
  CourseLevel,
  CourseQuantity,
  CourseType,
  durationLocalization,
  durations,
  levelLocalization,
  levels,
  quantity,
  typeLocalization,
  types,
} from "@/ui/pages/course/course.model.ts";
import { Image } from "@telegram-apps/telegram-ui/dist/components/Blocks/Image/Image";
import {
  Button,
  Caption,
  LargeTitle,
  List,
  Section,
} from "@telegram-apps/telegram-ui";

import { Paper } from "@/ui/atoms/paper/paper.tsx";
import { Select } from "@/ui/atoms/select/select.tsx";

import "./course.css";

export const CourseComponent = () => {
  const course = useLoaderData() as Course;
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel>("5-8");
  const [selectedQuantity, setSelectedQuantity] = useState<CourseQuantity>("1");
  const [selectedType, setSelectedType] = useState<CourseType>("individual");
  const [selectedDuration, setSelectedDuration] =
    useState<CourseDuration>("60");

  useEffect(() => {
    if (selectedType === "group" && selectedDuration === "60") {
      setSelectedDuration("90");
    }
  }, [selectedType, selectedDuration]);

  useEffect(() => {
    if (selectedQuantity === "1" && selectedType === "group") {
      setSelectedType("individual");
    }
  }, [selectedQuantity, selectedType]);

  const payload: InvoiceBody = useMemo(
    () => ({
      currency: "RUB",
      description: course?.description || "",
      payload: "payload",
      provider_token: import.meta.env.VITE_PROVIDER_TOKEN_TEST,
      prices: [
        {
          label: "Course",
          amount: "0",
        },
      ],
      title: course?.title || "",
      photo_url: course?.image,
      send_phone_number_to_provider: true,
      need_phone_number: true,
      need_name: true,
    }),
    [course],
  );

  const createInvoice = useCallback(
    async () =>
      await createInvoiceLink(payload)
        .then((url) => {
          if (url) {
            invoice?.open(url, "url").then((status) => {
              if (status === "paid") navigate("/");
            });
          }
        })
        .catch((err) => {
          console.log(err);
        }),
    [navigate, payload],
  );

  useEffect(() => {
    mountMainButton();
    setMainButtonParams({
      backgroundColor: "#000000",
      isVisible: true,
      text: "ENROLL",
      textColor: "#ffffff",
    });

    onMainButtonClick(createInvoice);

    return () =>
      setMainButtonParams({
        isVisible: false,
      });
  }, [createInvoice]);

  const handleSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      const payload = {
        level: selectedLevel,
        quantity: selectedQuantity,
        type: selectedType,
        duration: selectedDuration,
      };

      console.log(payload);
    },
    [selectedDuration, selectedLevel, selectedQuantity, selectedType],
  );

  const price = calculatePrice(
    selectedLevel,
    selectedQuantity,
    selectedType,
    selectedDuration,
  );

  return (
    <Page verticalPaddingDisabled horizontalPaddingDisabled>
      <div className={"course__info"}>
        <Image size={96} src={course.image} className={"course__image"} />
        <LargeTitle className={"course__title"}>{course.title}</LargeTitle>
        <Caption level={"2"} weight={"3"} className={"course__caption"}>
          {course.description}
        </Caption>
      </div>
      <Paper>
        <List>
          <form>
            <Section>
              <Select
                label={"Выберите уровень"}
                value={selectedLevel}
                onChange={setSelectedLevel}
              >
                {levels.map((level) => (
                  <option key={level}>{levelLocalization[level]}</option>
                ))}
              </Select>
              <Select
                label={"Количество занятий"}
                value={selectedQuantity}
                onChange={setSelectedQuantity}
              >
                {quantity.map((count) => (
                  <option key={count}>{count}</option>
                ))}
              </Select>
              <Select
                label={"Тип занятия"}
                value={selectedType}
                onChange={setSelectedType}
              >
                {types.map((type) => {
                  return (
                    <option
                      disabled={type === "group" && selectedQuantity === "1"}
                      key={type}
                    >
                      {typeLocalization[type]}
                    </option>
                  );
                })}
              </Select>
              <Select
                label={"Длительность"}
                value={selectedDuration}
                onChange={setSelectedDuration}
              >
                {durations.map((duration) => (
                  <option
                    disabled={duration === "60" && selectedType === "group"}
                    key={duration}
                  >
                    {durationLocalization[duration]}
                  </option>
                ))}
              </Select>
            </Section>
          </form>
        </List>
        <Button type={"submit"} onClick={(e) => handleSubmit(e)}>
          Записаться
        </Button>
      </Paper>
    </Page>
  );
};
