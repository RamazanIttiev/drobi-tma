export const BASE_CURRENCY = "RUB";

export type CloudStorageKeys =
  | "payment_token"
  | "payment_method_id"
  | "last_digits";

export const ngrokHeader =
  import.meta.env.MODE === "development"
    ? {
        "ngrok-skip-browser-warning": "true",
      }
    : null;
