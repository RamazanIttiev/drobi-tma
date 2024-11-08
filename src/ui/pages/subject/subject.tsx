import { useLocation } from "react-router-dom";
import { courses } from "@/mocks/courses.ts";
import { Page } from "@/ui/organisms/page/page.tsx";
import { useEffect } from "react";
import { mountMainButton, setMainButtonParams } from "@telegram-apps/sdk-react";

export const Subject = () => {
  const { state } = useLocation();

  useEffect(() => {
    mountMainButton();
    setMainButtonParams({
      backgroundColor: "#000000",
      isVisible: true,
      text: "ENROLL",
      textColor: "#ffffff",
    });
    return () =>
      setMainButtonParams({
        isVisible: false,
      });
  }, []);

  const subject = courses.find((course) => course.id === state);

  return <Page>{subject?.title}</Page>;
};
