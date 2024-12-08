import { useCallback, useEffect, useState } from "react";
import { AvailablePaymentData } from "@/ui/pages/payment/payment.model.ts";
import { IPaymentStatus, Payment } from "@a2seven/yoo-checkout";
import { PaymentStatusComponent } from "@/ui/pages/payment-status/payment-status.component.tsx";

import { useLocation, useNavigate } from "react-router-dom";
import { useMainButton } from "@/hooks/use-main-button.ts";
import { usePaymentViewModel } from "@/ui/pages/payment/payment-view-model.ts";

import "./payment-status.css";

interface PaymentStatusPageState {
  status: IPaymentStatus;
}

export const PaymentStatusPage = () => {
  const location = useLocation();
  const state = location.state as PaymentStatusPageState;

  const vm = usePaymentViewModel();
  const navigate = useNavigate();

  const [payment, setPayment] = useState<Payment | undefined>(undefined);

  const setPaymentData = useCallback(
    async (response: Payment) => {
      const last4 = response.payment_method.card?.last4;
      const first6 = response.payment_method.card?.first6;
      const type = response.payment_method.card?.card_type;

      if (!last4 || !first6 || !type) {
        return;
      }

      setPayment(response);

      const paymentData: AvailablePaymentData = {
        id: response.id,
        last4,
        first6,
        type,
      };

      await vm.addPaymentData(paymentData);
    },
    [vm],
  );

  useEffect(() => {
    const fetchPaymentData = async () => {
      const pendingPayment = await vm.getPendingPayment();

      try {
        if (pendingPayment?.id) {
          const payment = await vm.getPayment(pendingPayment.id);

          if (payment?.status === "succeeded") {
            await setPaymentData(payment);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        await vm.deletePendingPayment();
      }
    };

    fetchPaymentData().catch(console.error);
  }, [setPaymentData, vm]);

  useMainButton({ onClick: () => navigate("/"), text: "Домой" });

  return <PaymentStatusComponent status={state.status ?? payment?.status} />;
};
