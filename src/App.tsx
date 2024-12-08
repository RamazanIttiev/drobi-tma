import { miniApp, useLaunchParams, useSignal } from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { CourseCheckoutPage } from "@/ui/pages/course-checkout/course-checkout.component.tsx";
import { HomePage } from "@/ui/pages/home/home.tsx";
import { CoursePage } from "@/ui/pages/course/course.container.tsx";
import { fetchCourses } from "@/services/courses/fetchCourses.ts";
import { fetchCourse } from "@/services/courses/fetchCourse.ts";
import { PaymentPage } from "@/ui/pages/payment/payment.component.tsx";
import { PaymentProvider } from "@/context/payment-data.context.tsx";
import { PaymentStatusPage } from "@/ui/pages/payment-status/payment-status.tsx";

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
      <Route path="payment-details" element={<PaymentPage />} />

      <Route path="payment-status" element={<PaymentStatusPage />} />
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
      <PaymentProvider>
        <RouterProvider router={router} />
      </PaymentProvider>
    </AppRoot>
  );
}
