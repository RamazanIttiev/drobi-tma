import { Course } from "@/ui/pages/course/course.model.ts";

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
    // If 'err' is not an Error object, create a new one with its message.
    throw err instanceof Error
      ? err
      : new Error(`An error occurred: ${String(err)}`);
  }
};
