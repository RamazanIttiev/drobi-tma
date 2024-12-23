import { Payment } from "@a2seven/yoo-checkout";
import { addStudyRequestFromApi } from "@/services/studyRequest/add-study-request.ts";
import { PersonalDetails } from "@/ui/pages/personal-details/personal-details.model.ts";

export const handlePaymentPending = async (
  response: Payment,
  setPendingPayment: (payment: Payment) => Promise<void>,
  setMainButtonParams: (params: { isVisible: boolean }) => void,
) => {
  const confirmation_url =
    response.confirmation.confirmation_url ||
    response.confirmation.confirmation_data;

  try {
    await setPendingPayment(response);

    setMainButtonParams({
      isVisible: false,
    });

    if (confirmation_url) {
      window.location.href = confirmation_url;
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
