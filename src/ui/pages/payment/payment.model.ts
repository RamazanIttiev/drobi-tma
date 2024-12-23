import { BASE_CURRENCY, FieldErrors } from "@/common/models.ts";
import { IReceipt, IVatData } from "@a2seven/yoo-checkout/build/types";
import { PersonalDetails } from "@/ui/pages/personal-details/personal-details.model.ts";

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

export type PaymentMethodType = "bank_card" | "sberbank";
export type PaymentConfirmationType = "redirect" | "qr";

interface PaymentConfirmation {
  type: PaymentConfirmationType;
  locale?: string;
  confirmation_token?: string;
  confirmation_data?: string;
  confirmation_url?: string;
  enforce?: boolean;
  return_url?: string;
}

interface PaymentMethodData {
  type: PaymentMethodType;
  login?: string;
  phone?: string;
  payment_purpose?: string;
  vat_data?: IVatData;
  card?: {
    number: string;
    expiry_month: string;
    expiry_year: string;
    cardholder: string;
    csc: string;
  };
  payment_data?: string;
  payment_method_token?: string;
}

export interface CreatePayment {
  amount: {
    value: string;
    currency: string;
  };
  receipt: IReceipt;
  capture: boolean;
  confirmation: PaymentConfirmation;
  description: string;
  merchant_customer_id: string;
  save_payment_method?: boolean;
  payment_token?: string;
  payment_method_id?: string;
  payment_method_data?: PaymentMethodData;
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

export type TokenResponse = TokenSuccessResponse | TokenErrorResponse;

export interface AvailablePaymentData {
  id: string;
  last4?: string;
  first6?: string;
  bankCardType?: string;
  paymentMethodType: PaymentMethodType;
}

interface DefaultPaymentPayload {
  state: any;
  personalDetails: PersonalDetails;
}

interface InitialPaymentPayload extends DefaultPaymentPayload {
  paymentToken: string;
  save_payment_method: boolean;
}

interface SavedCardPaymentPayload extends DefaultPaymentPayload {
  payment_method_id: string;
}

interface SberPayPaymentPayload extends DefaultPaymentPayload {}

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

const getDefaultPayload = ({
  state,
  personalDetails,
}: DefaultPaymentPayload): CreatePayment => {
  return {
    capture: true,
    receipt: getPaymentReceipt(state, personalDetails),
    amount: {
      value: state.price.toString(),
      currency: BASE_CURRENCY,
    },
    merchant_customer_id: personalDetails.phone,
    description: `${personalDetails.name}: ${personalDetails.phone} (${state.title})`,
    confirmation: {
      type: "redirect",
      return_url: import.meta.env.VITE_PAYMENT_STATUS_URL,
    },
  };
};

export const getInitialPaymentPayload = ({
  state,
  personalDetails,
  paymentToken,
  save_payment_method,
}: InitialPaymentPayload): CreatePayment => {
  const payload = getDefaultPayload({
    state,
    personalDetails,
  });

  return {
    payment_token: paymentToken,
    save_payment_method,
    ...payload,
  };
};

export const getSavedCardPaymentPayload = ({
  state,
  personalDetails,
  payment_method_id,
}: SavedCardPaymentPayload): CreatePayment => {
  const payload = getDefaultPayload({
    state,
    personalDetails,
  });

  return {
    payment_method_id,
    ...payload,
  };
};

export const getSberPayPaymentPayload = ({
  state,
  personalDetails,
}: SberPayPaymentPayload): CreatePayment => {
  const payload = getDefaultPayload({
    state,
    personalDetails,
  });

  return {
    payment_method_data: {
      type: "sberbank",
    },
    ...payload,
  };
};

const getPaymentReceipt = (
  state: any,
  personalDetails: PersonalDetails,
): IReceipt => {
  return {
    customer: {
      email: personalDetails.email,
      phone: personalDetails.phone,
    },
    items: [
      {
        description: state.title,
        amount: {
          value: state.price.toString(),
          currency: BASE_CURRENCY,
        },
        vat_code: 1,
        quantity: "1",
        payment_subject: "service",
        payment_mode: "full_payment",
      },
    ],
  };
};

export const isTokenResponseSuccessful = (
  response: string | TokenErrorResponse,
): response is string => {
  return typeof response === "string";
};

export const DEFAULT_PAYMENT_METHOD: AvailablePaymentData = {
  id: "SberPay",
  paymentMethodType: "sberbank",
};
