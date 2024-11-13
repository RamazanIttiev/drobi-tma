import { useLocation, useNavigate } from "react-router-dom";
import { courses } from "@/mocks/courses.ts";
import { Page } from "@/ui/organisms/page/page.tsx";
import { useCallback, useEffect, useMemo } from "react";
import {
  invoice,
  mountMainButton,
  onMainButtonClick,
  setMainButtonParams,
} from "@telegram-apps/sdk-react";
import { createInvoiceLink } from "@/services/invoice/invoice.ts";
import { InvoiceBody } from "@/services/invoice/invoice.model.ts";

export const Course = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = courses.find((course) => course.id === state);

  const payload: InvoiceBody = useMemo(
    () => ({
      currency: "RUB",
      description: course?.description || "",
      payload: "payload",
      provider_token: import.meta.env.VITE_PROVIDER_TOKEN_TEST,
      prices: [
        {
          label: "Course",
          amount: course?.price || "0",
        },
      ],
      title: course?.title || "",
      photo_url: course?.image,
      send_phone_number_to_provider: true,
      need_phone_number: true,
      need_name: true,
    }),
    [course],
  );

  const createInvoice = useCallback(
    async () =>
      await createInvoiceLink(payload)
        .then((url) => {
          if (url) {
            invoice?.open(url, "url").then((status) => {
              if (status === "paid") navigate("/");
            });
          }
        })
        .catch((err) => {
          console.log(err);
        }),
    [navigate, payload],
  );

  useEffect(() => {
    mountMainButton();
    setMainButtonParams({
      backgroundColor: "#000000",
      isVisible: true,
      text: "ENROLL",
      textColor: "#ffffff",
    });

    onMainButtonClick(createInvoice);

    return () =>
      setMainButtonParams({
        isVisible: false,
      });
  }, [createInvoice]);

  return <Page>{course?.title}</Page>;
};
