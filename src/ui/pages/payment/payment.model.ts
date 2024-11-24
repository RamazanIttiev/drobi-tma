import { ICreatePayment } from "@a2seven/yoo-checkout";
import { BASE_CURRENCY } from "@/common/models.ts";

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

export interface CreatePaymentPayload extends ICreatePayment {}

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

export const getPaymentPayload = (
  payment_token: string,
  description: string,
  merchant_customer_id: string,
  amount: string,
): CreatePaymentPayload => {
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

export const isTokenResponseSuccessful = (
  response: string | TokenErrorResponse,
) => typeof response === "string";
