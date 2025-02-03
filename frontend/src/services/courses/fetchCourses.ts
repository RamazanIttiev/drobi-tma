import { Course } from "@/ui/pages/course/course.model.ts";
import { courses } from "@/mocks/courses.ts";
import axios from "axios";
import { ngrokHeader } from "@/common/models.ts";
import { API_URL } from "@/common/constants.ts";

export const fetchCourses = async (): Promise<Course[]> => {
  try {
    const response = await axios.get(`${API_URL}/courses`, {
      headers: { ...ngrokHeader },
    });

    return response.data;
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
