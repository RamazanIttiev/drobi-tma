import { Course } from "@/ui/pages/course/course.model.ts";
import { courses } from "@/mocks/courses.ts";

export const fetchCourse = async (id: string | undefined): Promise<Course> => {
  const coursesUrl = `${import.meta.env.VITE_API_URL}/course/${id}`;

  try {
    const res = await fetch(coursesUrl, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch the course: ${res.status} ${res.statusText}`,
      );
    }

    return await res.json();
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
