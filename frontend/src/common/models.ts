export const BASE_CURRENCY = "RUB";

export type CloudStorageKeys =
  | "payment_token"
  | "payment_data"
  | "selected_payment_data"
  | "pending_payment"
  | "personal_details";

export const ngrokHeader =
  import.meta.env.MODE === "development"
    ? {
        "ngrok-skip-browser-warning": "true",
      }
    : null;

export interface FieldErrors {
  [key: string]: string;
}
