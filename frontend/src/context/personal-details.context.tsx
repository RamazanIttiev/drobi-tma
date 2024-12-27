import React, { createContext, useContext, useState } from "react";
import { PersonalDetails } from "@/ui/pages/personal-details/personal-details.model.ts";

interface PersonalDetailsContextType {
  personalDetails: PersonalDetails;
  savePersonalDetails: boolean;
  setPersonalDetails: (details: PersonalDetails) => void;
  setSavePersonalDetails: (value: boolean) => void;
}

const defaultPersonalDetails: PersonalDetails = {
  name: "dwdwdw",
  email: "ram@gmail.com",
  phone: "9992060876",
};

const PersonalDetailsContext = createContext<PersonalDetailsContextType>({
  personalDetails: defaultPersonalDetails,
  savePersonalDetails: true,
  setPersonalDetails: () => {},
  setSavePersonalDetails: () => {},
});

export const PersonalDetailsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(
    defaultPersonalDetails,
  );

  const [savePersonalDetails, setSavePersonalDetails] = useState<boolean>(true);

  return (
    <PersonalDetailsContext.Provider
      value={{
        personalDetails,
        savePersonalDetails,
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
