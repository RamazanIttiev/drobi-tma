import { Course } from "@/ui/pages/course/course.model.ts";
import { courses } from "@/mocks/courses.ts";
import { fetchData } from "@/common/api/fetchData.ts";

export const fetchCourses = async (): Promise<Course[]> => {
  const url = `${import.meta.env.VITE_API_URL}/courses`;

  try {
    return await fetchData({ url });
  } catch (err) {
    if (
      import.meta.env.MODE === "development" &&
      import.meta.env.VITE_IS_MOCK_API === "true"
    ) {
      return courses;
    } else {
      console.log(err);
      throw Error(`Failed to fetch courses because server is down`);
    }
  }
};
