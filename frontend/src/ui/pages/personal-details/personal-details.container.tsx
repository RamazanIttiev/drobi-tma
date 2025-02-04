import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  PersonalDetails,
  validateField,
} from "@/ui/pages/personal-details/personal-details.model.ts";
import { FieldErrors } from "@/common/models.ts";
import { PersonalDetailsComponent } from "@/ui/pages/personal-details/personal-details.component.tsx";
import { useCloudStorage } from "@/hooks/use-cloud-storage.ts";
import { useMainButton } from "@/hooks/use-main-button.ts";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@telegram-apps/telegram-ui";

const defaultPersonalDetails: PersonalDetails = {
  name: "",
  email: "",
  phone: "",
};

export const PersonalDetailsContainer = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { getItem, addItem } = useCloudStorage();

  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(
    defaultPersonalDetails,
  );

  const [savePersonalDetails, setSavePersonalDetails] = useState<boolean>(true);

  useEffect(() => {
    const getPersonalDetailsFromCloud = async () => {
      const data = await getItem(["personal_details"]);

      if (data?.personal_details) {
        setPersonalDetails(data?.personal_details as PersonalDetails);
      }
    };

    getPersonalDetailsFromCloud().catch(console.error);
  }, [getItem]);

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

  const handleSubmit = useCallback(async () => {
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

    if (savePersonalDetails) await addItem("personal_details", personalDetails);

    setErrors({});
    navigate(-1);
  }, [addItem, navigate, personalDetails, savePersonalDetails]);

  useMainButton({ onClick: handleSubmit, text: "Сохранить" });

  return (
    <>
      <PersonalDetailsComponent
        errors={errors}
        personalDetails={personalDetails}
        savePersonalDetails={savePersonalDetails}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleSavePersonalDetails={handleSavePersonalDetails}
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
