import { Payment } from "@a2seven/yoo-checkout";
import { addStudyRequestFromApi } from "@/services/studyRequest/add-study-request.ts";
import { PersonalDetails } from "@/ui/pages/personal-details/personal-details.model.ts";
import { openLink } from "@telegram-apps/sdk-react";

export const handlePaymentPending = async (
  response: Payment,
  setPendingPayment: (payment: Payment) => Promise<void>,
) => {
  const confirmation_url =
    response.confirmation.confirmation_url ||
    response.confirmation.confirmation_data;

  try {
    // ToDo check for 3ds secure and execute setPendingPayment only if it is enabled
    if (response.payment_method.type === "bank_card") {
      await setPendingPayment(response);
    }

    if (confirmation_url) {
      openLink(confirmation_url);
    }
  } catch (e) {
    console.error(e);
  }
};

export const handleStudyRequest = async (personalDetails: PersonalDetails) => {
  await addStudyRequestFromApi({
    fullName: personalDetails.name,
    eMail: personalDetails.email,
    phone: personalDetails.phone,
  });
};
