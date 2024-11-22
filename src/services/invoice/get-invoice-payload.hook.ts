import { v4 as uuid } from "uuid";
import { InvoiceBody } from "@/services/invoice/invoice.model.ts";
import { CourseConfig } from "@/ui/pages/course/course.model.ts";
import { BASE_CURRENCY } from "@/common/models.ts";

export const getInvoicePayload = (
  config: CourseConfig,
  title: string,
  price: number,
  providerToken: string,
): InvoiceBody => {
  const { selectedLevel, selectedQuantity, selectedType, selectedDuration } =
    config;

  return {
    title: title || "",
    description: `
        Уровень: ${selectedLevel}, 
        Количество занятий: ${selectedQuantity}, 
        ${selectedType}, 
        ${selectedDuration}
      `,
    currency: BASE_CURRENCY,
    payload: uuid(),
    provider_token: providerToken,
    prices: [
      {
        label: "Сумма",
        amount: price * 100,
      },
    ],
    send_phone_number_to_provider: "true",
    need_phone_number: "true",
    need_name: "true",
  };
};
