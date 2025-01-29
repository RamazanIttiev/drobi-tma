import React from "react";
import { PersonalDetails } from "@/ui/pages/personal-details/personal-details.model.ts";
import { FieldErrors } from "@/common/models.ts";
import { PersonalDetailsComponent } from "@/ui/pages/personal-details/personal-details.component.tsx";
import { usePersonalDetails } from "@/context/personal-details.context.tsx";

interface PersonalDetailsContainerProps {
  errors?: FieldErrors;
  setErrors?: (errors: FieldErrors) => void;
  handleSubmit?: () => void;
}

export const PersonalDetailsContainer = (
  props: PersonalDetailsContainerProps,
) => {
  const { errors, setErrors, handleSubmit } = props;

  const { personalDetails, setPersonalDetails } = usePersonalDetails();

  const handleChange =
    (field: keyof PersonalDetails) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPersonalDetails({
        ...personalDetails,
        [field]: event.target.value,
      });

      setErrors?.({
        ...errors,
        [field]: "",
      });
    };

  return (
    <PersonalDetailsComponent
      errors={errors}
      personalDetails={personalDetails}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
