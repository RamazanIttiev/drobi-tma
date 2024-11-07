import { useLocation } from "react-router-dom";
import { courses } from "@/mocks/courses.ts";

export const Subject = () => {
  const { state } = useLocation();

  const subject = courses.find((course) => course.id === state);

  return <div>{subject?.title}</div>;
};
