import { ICreatePayment } from "@a2seven/yoo-checkout";
import { BASE_CURRENCY } from "@/common/models.ts";

interface YooKassaPayload {
  payment_token: string;
  description: string;
  merchant_customer_id: string;
  amount: string;
}

export const getYooKassaPayload = (props: YooKassaPayload): ICreatePayment => {
  const { payment_token, description, amount, merchant_customer_id } = props;

  return {
    payment_token,
    amount: {
      value: amount,
      currency: BASE_CURRENCY,
    },
    description,
    merchant_customer_id,
    capture: true,
    confirmation: {
      type: "redirect",
      return_url: import.meta.env.VITE_SUCCESS_PAYMENT_URL,
    },
  };
};
