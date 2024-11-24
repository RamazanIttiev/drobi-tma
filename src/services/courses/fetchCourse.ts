import { Course } from "@/ui/pages/course/course.model.ts";
import { courses } from "@/mocks/courses.ts";
import { fetchData } from "@/common/api/fetchData.ts";

export const fetchCourse = async (id: string | undefined): Promise<Course> => {
  const url = `${import.meta.env.VITE_API_URL}/course/${id}`;

  try {
    return await fetchData({ url });
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
