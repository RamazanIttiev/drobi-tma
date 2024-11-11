export interface InvoiceBody {
  /*
   * Product name, 1-32 characters
   */
  title: string;
  /*
   * Product description, 1-255 characters
   */
  description: string;
  /**
   * Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use for your internal processes.
   */
  payload: string;
  /**
   * Three-letter ISO 4217 currency code, see more on currencies. Pass “XTR” for payments in Telegram Stars.
   */
  currency: string;
  /**
   * Payment provider token, obtained via @BotFather. Pass an empty string for payments in Telegram Stars.
   */
  provider_token: string;
  /**
   * LabeledPrice	Yes	Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars.
   */
  prices: [
    {
      label: string;
      amount: string;
    },
  ];
  /**
   * Integer	Optional	The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double)
   */
  max_tip_amount?: string;
  /**
   * Array of Integer	Optional	A JSON-serialized array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount.
   */
  suggested_tip_amounts?: string[];
  /**
   * JSON-serialized data about the invoice, which will be shared with the payment provider.
   */
  provider_data?: string;
  /**
   * URL of the product photo for the invoice.
   */
  photo_url?: string;
  /**
   * Integer	Optional	Photo size in bytes
   */
  photo_size?: number;
  /**
   * Integer	Optional	Photo width
   */
  photo_width?: number;
  /**
   * Integer	Optional	Photo height
   */
  photo_height?: number;
  /*
   * Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars.
   */
  need_name?: boolean;
  /**
   * Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars.
   */
  need_phone_number?: boolean;
  /**
   * Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars.
   */
  need_email?: boolean;
  /**
   * Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars.
   */
  need_shipping_address?: boolean;
  /**
   * Pass True if the user's phone number should be sent to the provider. Ignored for payments in Telegram Stars.
   */
  send_phone_number_to_provider?: boolean;
  /**
   * Pass True if the user's email address should be sent to the provider. Ignored for payments in Telegram Stars.
   */
  send_email_to_provider?: boolean;
  /**
   * Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars.
   */
  is_flexible?: boolean;
}
