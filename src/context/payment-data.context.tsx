import React, { createContext, useContext, useState } from "react";
import { PaymentDetails } from "@/ui/pages/payment/payment.model.ts";

interface PaymentContextType {
  paymentDetails: PaymentDetails;
  save_payment_method: boolean;
  setPaymentDetails: (data: PaymentDetails) => void;
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
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(
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
