import { Payment } from "@a2seven/yoo-checkout";
import axios from "axios";

export const getPaymentFromApi = async (
  id: string,
): Promise<Payment | undefined> => {
  try {
    const response = await axios.get(`getPayment/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
