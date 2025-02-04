import React, { createContext, useContext, useEffect, useState } from "react";
import { PersonalDetails } from "@/ui/pages/personal-details/personal-details.model.ts";
import { useCloudStorage } from "@/hooks/use-cloud-storage.ts";

interface PersonalDetailsContextType {
  personalDetails: PersonalDetails;
  savePersonalDetails: boolean;
  setPersonalDetails: (details: PersonalDetails) => void;
  setSavePersonalDetails: (value: boolean) => void;
}

const defaultPersonalDetails: PersonalDetails = {
  name: "",
  email: "",
  phone: "",
};

const PersonalDetailsContext = createContext<PersonalDetailsContextType>({
  personalDetails: defaultPersonalDetails,
  savePersonalDetails: true,
  setSavePersonalDetails: () => {},
  setPersonalDetails: () => {},
});

export const PersonalDetailsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { getItem } = useCloudStorage();

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

  return (
    <PersonalDetailsContext.Provider
      value={{
        savePersonalDetails,
        personalDetails,
        setPersonalDetails,
        setSavePersonalDetails,
      }}
    >
      {children}
    </PersonalDetailsContext.Provider>
  );
};

export const usePersonalDetails = (): PersonalDetailsContextType => {
  const context = useContext(PersonalDetailsContext);
  if (!context) {
    throw new Error(
      "usePersonalDetails must be used within a PersonalDetailsProvider",
    );
  }
  return context;
};
