import { useState } from "react";
import {
  PersonalDetails,
  validateField,
} from "@/ui/pages/personal-details/personal-details.model.ts";
import { FieldErrors } from "@/common/models.ts";
import { usePersonalDetails } from "@/context/personal-details.context.tsx";
import { useMainButton } from "@/hooks/use-main-button.ts";
import { useNavigate } from "react-router-dom";
import { PersonalDetailsContainer } from "@/ui/pages/personal-details/personal-details.container.tsx";
import { Snackbar } from "@telegram-apps/telegram-ui";

export const PersonalDetailsPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { personalDetails } = usePersonalDetails();

  const handleSubmit = () => {
    const newErrors: FieldErrors = {};

    Object.entries(personalDetails).forEach(([field, value]) => {
      const error = validateField(field as keyof typeof personalDetails, value);

      if (error) {
        newErrors[field as keyof PersonalDetails] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Saving personal details:", personalDetails);
    setErrors({});
    navigate(-1);
  };

  useMainButton({ onClick: handleSubmit, text: "Сохранить" });

  return (
    <>
      <PersonalDetailsContainer
        errors={errors}
        setErrors={setErrors}
        handleSubmit={handleSubmit}
      />
      {errorMessage && (
        <Snackbar
          children={errorMessage}
          duration={5000}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </>
  );
};
