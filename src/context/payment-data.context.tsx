import React, { createContext, useContext, useState } from "react";

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardHolder: string;
}

interface PaymentContextType {
  paymentData: PaymentData;
  payment_token: string | undefined;
  setPaymentData: (data: PaymentData) => void;
  setPaymentToken: (token: string) => void;
}

const PaymentContext = createContext<PaymentContextType>({
  paymentData: {
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    cardHolder: "",
  },
  payment_token: undefined,
  setPaymentData: () => {},
  setPaymentToken: () => {},
});

export const PaymentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    cardHolder: "",
  });

  const [payment_token, setPaymentToken] = useState<string | undefined>(
    undefined,
  );

  return (
    <PaymentContext.Provider
      value={{ paymentData, payment_token, setPaymentData, setPaymentToken }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
