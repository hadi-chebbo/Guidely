"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { AlertCircle, CheckCircle2, Loader2, LockKeyhole } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import Button from "@/components/ui/Button";
import { getStudentReservation } from "@/services/studentService";
import { clearReservationClientSecret } from "./reservationPaymentStorage";

type PaymentState = "ready" | "submitting" | "syncing" | "success" | "error";

interface PaymentFormProps {
  reservationUuid: string;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function PaymentForm({ reservationUuid }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [state, setState] = useState<PaymentState>("ready");
  const [message, setMessage] = useState<string | null>(null);

  const syncReservationConfirmation = async () => {
    setState("syncing");
    setMessage("Payment received. Waiting for the reservation confirmation.");

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const reservation = await getStudentReservation(reservationUuid);

      if (reservation?.status === "confirmed") {
        clearReservationClientSecret(reservationUuid);
        await queryClient.invalidateQueries({ queryKey: ["student-sessions"] });
        await queryClient.invalidateQueries({ queryKey: ["student-reservations"] });
        setState("success");
        router.replace(`/student/success?reservation=${reservationUuid}`);
        return;
      }

      if (reservation?.status && reservation.status !== "pending") {
        throw new Error(`Reservation is ${reservation.status}.`);
      }

      await wait(1500);
    }

    router.replace(`/student/success?reservation=${reservationUuid}&pending=1`);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || state === "submitting" || state === "syncing") {
      return;
    }

    setState("submitting");
    setMessage(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/student/success?reservation=${reservationUuid}`,
      },
      redirect: "if_required",
    });

    if (result.error) {
      setState("error");
      setMessage(result.error.message ?? "Payment could not be completed.");
      return;
    }

    try {
      await syncReservationConfirmation();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Payment completed, but reservation status could not be synced.",
      );
    }
  };

  const isBusy = state === "submitting" || state === "syncing";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement
        options={{
          layout: "tabs",
          paymentMethodOrder: ["card"],
        }}
      />

      {message && (
        <div
          className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
            state === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {state === "error" ? (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : state === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />
          )}
          <span>{message}</span>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={!stripe || !elements || isBusy}
        isLoading={isBusy}
        leftIcon={<LockKeyhole className="h-4 w-4" />}
      >
        {state === "syncing" ? "Confirming reservation" : "Pay and confirm"}
      </Button>
    </form>
  );
}
