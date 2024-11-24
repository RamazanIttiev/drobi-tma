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

interface TokenErrorResponse {
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

export type TokenResponse = TokenSuccessResponse | TokenErrorResponse;
