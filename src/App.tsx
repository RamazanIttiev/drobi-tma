import { miniApp, useLaunchParams, useSignal } from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { CourseCheckoutComponent } from "@/ui/pages/course/checkout/checkout.tsx";
import { HomeComponent } from "@/ui/pages/home/home.tsx";
import { CourseComponent } from "@/ui/pages/course/course.tsx";
import { fetchCourses } from "@/services/courses/fetchCourses.ts";
import { fetchCourse } from "@/services/courses/fetchCourse.ts";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<HomeComponent />} loader={fetchCourses} />
      <Route
        path="subject/:id"
        element={<CourseComponent />}
        loader={({ params }) => fetchCourse(params.id)}
      />
      <Route path="checkout/:id" element={<CourseCheckoutComponent />} />
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
