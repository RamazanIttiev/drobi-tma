import maths from "../assets/maths.jpg";
import russian from "../assets/russian.png";
import { CoursesModel } from "@/models/courses.model.ts";

export const courses: CoursesModel[] = [
  {
    id: 1,
    title: "Maths",
    description:
      "Maths is the study of topics such as quantity, structure, space, and change.",
    image: maths,
    price: 100,
  },
  {
    id: 2,
    title: "Russian",
    description:
      "Russian is an East Slavic language native to the Russians in Eastern Europe.",
    image: russian,
    price: 200,
  },
];
