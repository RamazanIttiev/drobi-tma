import React, { ChangeEvent, useCallback } from "react";
import { PersonalDetails } from "@/ui/pages/personal-details/personal-details.model.ts";
import { FieldErrors } from "@/common/models.ts";
import { PersonalDetailsComponent } from "@/ui/pages/personal-details/personal-details.component.tsx";
import { usePersonalDetails } from "@/context/personal-details.context.tsx";

interface PersonalDetailsContainerProps {
  errors?: FieldErrors;
  setErrors?: (errors: FieldErrors) => void;
  handleSubmit: () => void;
}

export const PersonalDetailsContainer = (
  props: PersonalDetailsContainerProps,
) => {
  const { errors, setErrors, handleSubmit } = props;

  const { personalDetails, setPersonalDetails, setSavePersonalDetails } =
    usePersonalDetails();

  const handleChange =
    (field: keyof PersonalDetails) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (personalDetails) {
        setPersonalDetails({
          ...personalDetails,
          [field]: event.target.value,
        });
      }

      setErrors?.({
        ...errors,
        [field]: "",
      });
    };

  const handleSavePersonalDetails = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSavePersonalDetails(event.target.checked);
    },
    [setSavePersonalDetails],
  );

  return (
    <PersonalDetailsComponent
      errors={errors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleSavePersonalDetails={handleSavePersonalDetails}
    />
  );
};
