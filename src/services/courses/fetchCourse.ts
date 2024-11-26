import { Course } from "@/ui/pages/course/course.model.ts";
import { courses } from "@/mocks/courses.ts";
import axios from "axios";
import { ngrokHeader } from "@/common/models.ts";

export const fetchCourse = async (id: string | undefined): Promise<Course> => {
  try {
    return await axios.get(`/course/${id}`, { headers: { ...ngrokHeader } });
  } catch (err) {
    if (
      import.meta.env.MODE === "development" &&
      import.meta.env.VITE_IS_MOCK_API === "true"
    ) {
      return courses.find((course) => course.id === id)!;
    } else {
      console.log(err);
      return Promise.reject(
        new Error(`Failed to fetch the course because server is down`),
      );
    }
  }
};
