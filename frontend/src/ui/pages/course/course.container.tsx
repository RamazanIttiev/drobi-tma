import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  calculatePrice,
  CourseConfig,
  CourseDuration,
  CourseLevel,
  CourseQuantity,
  CourseType,
} from "@/ui/pages/course/course.model.ts";
import { useMainButton } from "@/hooks/use-main-button.ts";
import { CourseComponent } from "@/ui/pages/course/course.component.tsx";
import { courses } from "@/mocks/courses.ts";

import "./course.css";

export const CoursePage = () => {
  const location = useLocation();
  const courseId = location.state;

  const course = courses.find((course) => course.id === courseId);
  const navigate = useNavigate();

  const [config, setConfig] = useState<CourseConfig>({
    level: "5-8 класс",
    quantity: "1",
    type: "Индивидуально",
    duration: "60 минут",
  });

  const { level, quantity, type, duration } = config;

  const price = calculatePrice(level, quantity, type, duration);

  useEffect(() => {
    if (type === "В группе" && duration === "60 минут") {
      setConfig((prevState) => ({
        ...prevState,
        duration: "90 минут",
      }));
    }
  }, [duration, type]);

  useEffect(() => {
    if (quantity === "1" && type === "В группе") {
      setConfig((prevState) => ({
        ...prevState,
        type: "Индивидуально",
      }));
    }
  }, [quantity, type]);

  const navigateToCheckout = useCallback(() => {
    navigate(`/checkout/${course?.id}`, {
      state: {
        title: course?.title,
        price,
        config,
      },
    });
  }, [config, course?.id, course?.title, navigate, price]);

  useMainButton({
    text: `К оплате ${price.toString()} ₽`,
    onClick: navigateToCheckout,
  });

  const onLevelChange = (value: CourseLevel) => {
    setConfig((prevState) => ({
      ...prevState,
      level: value,
    }));
  };

  const onQuantityChange = (value: CourseQuantity) => {
    setConfig((prevState) => ({
      ...prevState,
      quantity: value,
    }));
  };

  const onTypeChange = (value: CourseType) => {
    setConfig((prevState) => ({
      ...prevState,
      type: value,
    }));
  };

  const onDurationChange = (value: CourseDuration) => {
    setConfig((prevState) => ({
      ...prevState,
      duration: value,
    }));
  };

  return (
    course && (
      <CourseComponent
        course={course}
        config={config}
        onDurationChange={onDurationChange}
        onTypeChange={onTypeChange}
        onLevelChange={onLevelChange}
        onQuantityChange={onQuantityChange}
        navigateToCheckout={navigateToCheckout}
      />
    )
  );
};
