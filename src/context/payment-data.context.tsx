import React, { createContext, useContext, useState } from "react";
import { PaymentData } from "@/ui/pages/payment/payment.model.ts";

interface PaymentContextType {
  paymentDetails: PaymentData;
  save_payment_method: boolean;
  setPaymentDetails: (data: PaymentData) => void;
  setSavePaymentMethod: (value: boolean) => void;
}

export const initialPaymentDetails = {
  cardNumber: "",
  expiryDate: "",
  cvc: "",
};

const PaymentContext = createContext<PaymentContextType>({
  paymentDetails: initialPaymentDetails,
  save_payment_method: true,
  setPaymentDetails: () => {},
  setSavePaymentMethod: () => {},
});

export const PaymentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentData>(
    initialPaymentDetails,
  );

  const [save_payment_method, setSavePaymentMethod] = useState<boolean>(true);

  return (
    <PaymentContext.Provider
      value={{
        paymentDetails,
        save_payment_method,
        setPaymentDetails,
        setSavePaymentMethod,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
