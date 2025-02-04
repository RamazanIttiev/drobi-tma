import {
  miniApp,
  mountSecondaryButton,
  onSecondaryButtonClick,
  setMiniAppBottomBarColor,
  setMiniAppHeaderColor,
  setSecondaryButtonParams,
  useLaunchParams,
  useSignal,
} from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { CourseCheckoutPage } from "@/ui/pages/course-checkout/course-checkout.container.tsx";
import { HomePage } from "@/ui/pages/home/home.tsx";
import { CoursePage } from "@/ui/pages/course/course.container.tsx";
import { PaymentPage } from "@/ui/pages/payment/payment.container.tsx";
import { PaymentProvider } from "@/context/payment-data.context.tsx";
import { PaymentStatusPage } from "@/ui/pages/payment-status/payment-status.container.tsx";
import { PersonalDetailsContainer } from "@/ui/pages/personal-details/personal-details.container.tsx";
import { useEffect } from "react";
import { useCloudStorage } from "@/hooks/use-cloud-storage.ts";
import { CloudStorageKeys } from "@/common/models.ts";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<HomePage />} />
      <Route path="subject/:id" element={<CoursePage />} />
      <Route path="checkout/:id" element={<CourseCheckoutPage />} />
      <Route path="payment-details" element={<PaymentPage />} />
      <Route path="personal-details" element={<PersonalDetailsContainer />} />

      <Route path="payment-status" element={<PaymentStatusPage />} />
    </>,
  ),
);

export function App() {
  const { themeParams } = useLaunchParams();
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);

  const { getItem, getKeys, deleteItem } = useCloudStorage();

  useEffect(() => {
    if (themeParams.secondaryBgColor) {
      setMiniAppHeaderColor(themeParams.secondaryBgColor);
      setMiniAppBottomBarColor(themeParams.secondaryBgColor);
    }
  }, [themeParams]);

  useEffect(() => {
    if (import.meta.env.MODE === "development") {
      getKeys()?.then((res) => {
        getItem(res).then((items) => {
          console.log("cloud", items);
        });
      });

      mountSecondaryButton();
      setSecondaryButtonParams({
        isVisible: true,
        text: "Cloud",
      });

      onSecondaryButtonClick(
        async () =>
          await getKeys()?.then(async (res) => {
            await getItem(res).then((items) => {
              if (items) {
                Object.keys(items).forEach((key) => {
                  deleteItem(key as CloudStorageKeys);
                });
              }
            });
          }),
      );
    }
  }, [deleteItem, getItem, getKeys]);

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
