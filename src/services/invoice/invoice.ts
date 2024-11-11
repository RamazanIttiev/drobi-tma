import { InvoiceBody } from "@/services/invoice/invoice.model.ts";

export const createInvoiceLink = async (payload: InvoiceBody) => {
  try {
    const response = await fetch("http://localhost:3000/createInvoiceLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
  } catch (error) {
    console.log("error", error);
  }
};
