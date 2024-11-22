import { Course } from "@/ui/pages/course/course.model.ts";
import { courses } from "@/mocks/courses.ts";

export const fetchCourses = async (): Promise<Course[]> => {
  const coursesUrl = `${import.meta.env.VITE_API_URL}/courses`;

  try {
    const res = await fetch(coursesUrl, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch courses: ${res.status} ${res.statusText}`,
      );
    }

    return await res.json();
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
