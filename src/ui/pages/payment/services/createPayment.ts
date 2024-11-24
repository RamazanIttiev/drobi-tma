import { ICreatePayment, Payment } from "@a2seven/yoo-checkout";

export const createPayment = async (
  payload: ICreatePayment,
): Promise<Payment | undefined> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/createPayment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log("error", error);
  }
};
