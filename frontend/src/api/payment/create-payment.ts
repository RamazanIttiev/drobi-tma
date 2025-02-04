import { Payment } from "@a2seven/yoo-checkout";
import { CreatePayment } from "@/ui/pages/payment/payment.model.ts";
import axios from "axios";
import { API_URL } from "@/common/constants.ts";

export const createPaymentFromApi = async (
  payload: CreatePayment,
): Promise<Payment | undefined> => {
  try {
    const response = await axios.post(`${API_URL}/createPayment`, payload);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
