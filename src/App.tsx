import { miniApp, useLaunchParams, useSignal } from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { CourseCheckoutPage } from "@/ui/pages/course/checkout/checkout.tsx";
import { HomePage } from "@/ui/pages/home/home.tsx";
import { CoursePage } from "@/ui/pages/course/course.tsx";
import { fetchCourses } from "@/services/courses/fetchCourses.ts";
import { fetchCourse } from "@/services/courses/fetchCourse.ts";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<HomePage />} loader={fetchCourses} />
      <Route
        path="subject/:id"
        element={<CoursePage />}
        loader={({ params }) => fetchCourse(params.id)}
      />
      <Route path="checkout/:id" element={<CourseCheckoutPage />} />
    </>,
  ),
);

export function App() {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);

  return (
    <AppRoot
      appearance={isDark ? "dark" : "light"}
      platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
    >
      <RouterProvider router={router} />
    </AppRoot>
  );
}
