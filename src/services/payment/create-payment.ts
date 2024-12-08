import { ICreatePayment, Payment } from "@a2seven/yoo-checkout";
import axios from "axios";

export const createPaymentFromApi = async (
  payload: ICreatePayment,
): Promise<Payment | undefined> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/createPayment`,
      payload,
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
