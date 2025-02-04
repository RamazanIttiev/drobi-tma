import React, { createContext, useContext, useState } from "react";
import { PersonalDetails } from "@/ui/pages/personal-details/personal-details.model.ts";

interface PersonalDetailsContextType {
  // personalDetailsFromCloud: PersonalDetails;
  personalDetails: PersonalDetails;
  // savePersonalDetails: boolean;
  setPersonalDetails: (details: PersonalDetails) => void;
  // setSavePersonalDetails: (value: boolean) => void;
}

const defaultPersonalDetails: PersonalDetails = {
  name: "dwdaw",
  email: "",
  phone: "+7 (999) 999-99-99",
};

const PersonalDetailsContext = createContext<PersonalDetailsContextType>({
  personalDetails: defaultPersonalDetails,
  setPersonalDetails: () => {},
});

export const PersonalDetailsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(
    defaultPersonalDetails,
  );

  return (
    <PersonalDetailsContext.Provider
      value={{
        personalDetails,
        setPersonalDetails,
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
