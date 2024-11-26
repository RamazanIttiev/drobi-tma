import { ICreatePayment, Payment } from "@a2seven/yoo-checkout";
import axios from "axios";

export const createPaymentFroApi = async (
  payload: ICreatePayment,
): Promise<{ data: Payment } | undefined> => {
  try {
    return await axios.post(`${import.meta.env.VITE_API_URL}/createPayment`, {
      payload,
    });
  } catch (error) {
    console.log(error);
  }
};
