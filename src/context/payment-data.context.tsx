import React, { createContext, useContext, useState } from "react";
import { PaymentData } from "@/ui/pages/payment/payment.model.ts";

interface PaymentContextType {
  paymentDetails: PaymentData;
  payment_token: string | undefined;
  save_payment_method: boolean;
  setPaymentDetails: (data: PaymentData) => void;
  setPaymentToken: (token: string) => void;
  setSavePaymentMethod: (value: boolean) => void;
}

const PaymentContext = createContext<PaymentContextType>({
  paymentDetails: {
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  },
  save_payment_method: true,
  payment_token: undefined,
  setPaymentDetails: () => {},
  setPaymentToken: () => {},
  setSavePaymentMethod: () => {},
});

export const PaymentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentData>({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  const [payment_token, setPaymentToken] = useState<string | undefined>(
    undefined,
  );

  const [save_payment_method, setSavePaymentMethod] = useState<boolean>(true);

  return (
    <PaymentContext.Provider
      value={{
        paymentDetails,
        payment_token,
        save_payment_method,
        setPaymentDetails,
        setPaymentToken,
        setSavePaymentMethod,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
