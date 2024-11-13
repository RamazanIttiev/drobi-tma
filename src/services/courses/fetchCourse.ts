import { Course } from "@/ui/pages/course/course.model.ts";

export const fetchCourse = async (id: string | undefined): Promise<Course> => {
  const coursesUrl = `${import.meta.env.VITE_API_URL}/course/${id}`;

  try {
    const res = await fetch(coursesUrl);

    if (!res.ok) {
      throw new Error(
        `Failed to fetch the course: ${res.status} ${res.statusText}`,
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
