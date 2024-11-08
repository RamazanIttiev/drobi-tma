import { useLocation } from "react-router-dom";
import { courses } from "@/mocks/courses.ts";
import { Page } from "@/ui/organisms/page/page.tsx";

export const Subject = () => {
  const { state } = useLocation();

  const subject = courses.find((course) => course.id === state);

  return <Page>{subject?.title}</Page>;
};
