import { Course } from "@/ui/pages/course/course.model.ts";

import maths from "@/assets/images/maths.jpg";
import physics from "@/assets/images/physics.jpg";
import chemistry from "@/assets/images/chemistry.jpg";
import history from "@/assets/images/history.jpg";
import russian from "@/assets/images/russian.jpg";
import english from "@/assets/images/english.jpg";
import technology from "@/assets/images/tech.jpg";
import society from "@/assets/images/society.jpg";

export const courses: Course[] = [
  {
    id: "1",
    title: "Математика",
    description: "Изучите математику с нуля",
    image: maths,
  },
  {
    id: "2",
    title: "Физика",
    description: "Изучите физику с нуля",
    image: physics,
  },
  {
    id: "3",
    title: "Химия",
    description: "Изучите химию с нуля",
    image: chemistry,
  },
  {
    id: "4",
    title: "История",
    description: "Изучите историю с нуля",
    image: history,
  },
  {
    id: "5",
    title: "Русский язык",
    description: "Изучите русский язык с нуля",
    image: russian,
  },
  {
    id: "6",
    title: "Английский язык",
    description: "Изучите английский язык с нуля",
    image: english,
  },
  {
    id: "7",
    title: "Технология",
    description: "Изучите технологию с нуля",
    image: technology,
  },
  {
    id: "8",
    title: "Общество",
    description: "Изучите общество с нуля",
    image: society,
  },
];
