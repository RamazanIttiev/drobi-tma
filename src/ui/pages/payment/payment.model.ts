import { ICreatePayment, Payment } from "@a2seven/yoo-checkout";
import { BASE_CURRENCY } from "@/common/models.ts";

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

export interface CreatePaymentPayload extends ICreatePayment {}
export interface CreatePaymentResponse {
  data: Payment;
}

interface TokenSuccessResponse {
  data: {
    message: string;
    response: {
      paymentToken: string;
    };
    status_code: number;
    type: string;
  };
  status: "success";
}

export interface TokenErrorResponse {
  error: {
    code: string;
    message: string;
    params: Array<{
      code: string;
      message: string;
    }>;
    status_code: number;
    type: string;
  };
  status: "error";
}

export interface FieldErrors {
  [key: string]: string;
}

export type TokenResponse = TokenSuccessResponse | TokenErrorResponse;

export interface AvailablePaymentData {
  id: string;
  last4: string;
  first6: string;
  type: string;
}

const fieldErrorMapping: Record<string, string> = {
  invalid_number: "cardNumber",
  invalid_expiry_month: "expiryDate",
  invalid_expiry_year: "expiryDate",
  invalid_cvc: "cvc",
};

export const mapErrorsToFields = (
  errorResponse: TokenErrorResponse,
): FieldErrors => {
  const fieldErrors: FieldErrors = {};

  errorResponse.error.params.forEach((param) => {
    const fieldName = fieldErrorMapping[param.code];
    if (fieldName) {
      fieldErrors[fieldName] = param.message;
    }
  });

  return fieldErrors;
};

export const getPaymentPayload = ({
  payment_token,
  selectedPaymentData,
  amount,
  description,
  merchant_customer_id,
  save_payment_method,
  payment_method_id,
}: Omit<ICreatePayment, "amount"> & {
  amount: string;
  selectedPaymentData?: AvailablePaymentData;
}): ICreatePayment => {
  const payload: ICreatePayment = {
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
      return_url: import.meta.env.VITE_PAYMENT_STATUS_URL,
    },
    save_payment_method,
    payment_method_id,
  };

  if (payment_token && !selectedPaymentData?.id) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { payment_method_id, ...initialPayment } = payload;
    return initialPayment;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { payment_token, ...savedPayment } = payload;

    return savedPayment;
  }
};

export const isTokenResponseSuccessful = (
  response: string | TokenErrorResponse,
): response is string => {
  return typeof response === "string";
};
