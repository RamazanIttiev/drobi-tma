import { Payment } from "@a2seven/yoo-checkout";
import axios from "axios";
import { ngrokHeader } from "@/common/models.ts";

export const getPaymentFromApi = async (
  id: string,
): Promise<Payment | undefined> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/getPayment/${id}`,
      { headers: { ...ngrokHeader } },
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
