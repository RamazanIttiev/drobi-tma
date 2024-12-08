import { Page } from "@/ui/organisms/page/page.tsx";
import {
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

interface CourseComponentProps {
  course: Course;
  config: CourseConfig;
  onQuantityChange: (value: CourseQuantity) => void;
  onLevelChange: (value: CourseLevel) => void;
  onTypeChange: (value: CourseType) => void;
  onDurationChange: (value: CourseDuration) => void;
}

export const CourseComponent = (props: CourseComponentProps) => {
  const {
    course,
    config,
    onTypeChange,
    onQuantityChange,
    onLevelChange,
    onDurationChange,
  } = props;

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
              value={config.level}
              onChange={onLevelChange}
            >
              {levels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </Select>
            <Select
              label={"Количество занятий"}
              value={config.quantity}
              onChange={onQuantityChange}
            >
              {quantity.map((count) => (
                <option key={count}>{count}</option>
              ))}
            </Select>
            <Select
              label={"Тип занятия"}
              value={config.type}
              onChange={onTypeChange}
            >
              {types.map((type) => {
                return (
                  <option
                    disabled={type === "В группе" && config.quantity === "1"}
                    key={type}
                  >
                    {type}
                  </option>
                );
              })}
            </Select>
            <Select
              label={"Длительность"}
              value={config.duration}
              onChange={onDurationChange}
            >
              {durations.map((duration) => (
                <option
                  disabled={
                    duration === "60 минут" && config.type === "В группе"
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
