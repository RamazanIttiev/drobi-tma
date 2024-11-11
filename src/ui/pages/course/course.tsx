import { useLocation } from "react-router-dom";
import { courses } from "@/mocks/courses.ts";
import { Page } from "@/ui/organisms/page/page.tsx";
import { useEffect } from "react";
import {
  invoice,
  mountMainButton,
  onMainButtonClick,
  setMainButtonParams,
} from "@telegram-apps/sdk-react";
import { createInvoiceLink } from "@/services/invoice/invoice.ts";

export const Course = () => {
  const { state } = useLocation();

  const createInvoice = async () =>
    await createInvoiceLink({
      title: "Maths",
      description: "string",
      payload: "string",
      currency: "RUB",
      provider_token: import.meta.env.VITE_PROVIDER_TOKEN_TEST,
      prices: [
        {
          label: "string",
          amount: "100000",
        },
      ],
    })
      .then((url) => {
        if (url) {
          invoice?.open(url, "url").then((status) => {
            return console.log(status);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });

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
  }, []);

  const course = courses.find((course) => course.id === state);

  return <Page>{course?.title}</Page>;
};
