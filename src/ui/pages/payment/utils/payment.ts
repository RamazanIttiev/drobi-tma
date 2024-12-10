import { Payment } from "@a2seven/yoo-checkout";
import { addStudyRequestFromApi } from "@/services/studyRequest/add-study-request.ts";
import { PersonalDetails } from "@/ui/pages/personal-details/personal-details.model.ts";

export const handlePaymentPending = async (
  response: Payment,
  setPendingPayment: (payment: Payment) => Promise<void>,
  setMainButtonParams: (params: { isVisible: boolean }) => void,
) => {
  const confirmation_url = response.confirmation.confirmation_url;

  // Store pending payment
  await setPendingPayment(response);

  // Update main button state
  setMainButtonParams({
    isVisible: false,
  });

  // Redirect if confirmation URL exists
  if (confirmation_url) {
    window.location.href = confirmation_url;
  }
};

export const handleStudyRequest = async (personalDetails: PersonalDetails) => {
  await addStudyRequestFromApi({
    fullName: personalDetails.name,
    eMail: personalDetails.email,
    phone: personalDetails.phone,
  });
};
