import { useLoaderData, useNavigate } from "react-router-dom";
import { Page } from "@/ui/organisms/page/page.tsx";
import { useCallback, useEffect, useState } from "react";
import {
  mainButton,
  mountMainButton,
  onMainButtonClick,
  setMainButtonParams,
  useLaunchParams,
} from "@telegram-apps/sdk-react";
import {
  calculatePrice,
  Course,
  CourseConfig,
  CourseDuration,
  CourseLevel,
  CourseQuantity,
  CourseType,
  durations,
  levels,
  quantity,
  types,
} from "@/ui/pages/course/course.model.ts";
import { Image } from "@telegram-apps/telegram-ui/dist/components/Blocks/Image/Image";
import { Caption, LargeTitle, List, Section } from "@telegram-apps/telegram-ui";
import { Select } from "@/ui/atoms/select/select.tsx";

import "./course.css";

export const CoursePage = () => {
  const course = useLoaderData() as Course;
  const navigate = useNavigate();
  const { themeParams } = useLaunchParams();

  const [config, setConfig] = useState<CourseConfig>({
    selectedLevel: "5-8 класс",
    selectedQuantity: "1",
    selectedType: "Индивидуально",
    selectedDuration: "60 минут",
  });

  const { selectedLevel, selectedQuantity, selectedType, selectedDuration } =
    config;

  useEffect(() => {
    if (selectedType === "В группе" && selectedDuration === "60 минут") {
      setConfig((prevState) => ({
        ...prevState,
        selectedDuration: "90 минут",
      }));
    }
  }, [selectedDuration, selectedType]);

  useEffect(() => {
    if (selectedQuantity === "1" && selectedType === "В группе") {
      setConfig((prevState) => ({
        ...prevState,
        selectedType: "Индивидуально",
      }));
    }
  }, [selectedQuantity, selectedType]);

  const price = calculatePrice(
    selectedLevel,
    selectedQuantity,
    selectedType,
    selectedDuration,
  );

  const navigateToCheckout = useCallback(() => {
    navigate(`/checkout/${course.id}`, {
      state: {
        title: course.title,
        price,
        config,
      },
    });
  }, [config, course.id, course.title, navigate, price]);

  useEffect(() => {
    mountMainButton();
    setMainButtonParams({
      backgroundColor: themeParams?.buttonColor,
      isVisible: true,
      text: `К оплате ${price.toString()} ₽`,
    });

    return () => {
      setMainButtonParams({
        isVisible: false,
      });
    };
  }, [course.id, navigateToCheckout, price, themeParams?.buttonColor]);

  useEffect(() => {
    onMainButtonClick(navigateToCheckout);

    return () => mainButton.offClick(navigateToCheckout);
  }, [navigateToCheckout]);

  const onLevelChange = (value: CourseLevel) => {
    setConfig((prevState) => ({
      ...prevState,
      selectedLevel: value,
    }));
  };

  const onQuantityChange = (value: CourseQuantity) => {
    setConfig((prevState) => ({
      ...prevState,
      selectedQuantity: value,
    }));
  };

  const onTypeChange = (value: CourseType) => {
    setConfig((prevState) => ({
      ...prevState,
      selectedType: value,
    }));
  };

  const onDurationChange = (value: CourseDuration) => {
    setConfig((prevState) => ({
      ...prevState,
      selectedDuration: value,
    }));
  };

  return (
    <Page verticalPaddingDisabled horizontalPaddingDisabled fixed>
      <div className={"course__info"}>
        <Image size={96} src={course.image} className={"course__image"} />
        <LargeTitle className={"course__title"}>{course.title}</LargeTitle>
        <Caption level={"2"} weight={"3"} className={"course__caption"}>
          {course.description}
        </Caption>
      </div>
      <List className={"course__list"}>
        <form>
          <Section className={"course__section"}>
            <Select
              label={"Выберите уровень"}
              value={selectedLevel}
              onChange={onLevelChange}
            >
              {levels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </Select>
            <Select
              label={"Количество занятий"}
              value={selectedQuantity}
              onChange={onQuantityChange}
            >
              {quantity.map((count) => (
                <option key={count}>{count}</option>
              ))}
            </Select>
            <Select
              label={"Тип занятия"}
              value={selectedType}
              onChange={onTypeChange}
            >
              {types.map((type) => {
                return (
                  <option
                    disabled={type === "В группе" && selectedQuantity === "1"}
                    key={type}
                  >
                    {type}
                  </option>
                );
              })}
            </Select>
            <Select
              label={"Длительность"}
              value={selectedDuration}
              onChange={onDurationChange}
            >
              {durations.map((duration) => (
                <option
                  disabled={
                    duration === "60 минут" && selectedType === "В группе"
                  }
                  key={duration}
                >
                  {duration}
                </option>
              ))}
            </Select>
          </Section>
        </form>
      </List>
    </Page>
  );
};
