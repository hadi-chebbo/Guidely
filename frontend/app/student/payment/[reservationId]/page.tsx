"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { AlertCircle, CalendarCheck, CreditCard, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import PaymentForm from "@/components/sessions/PaymentForm";
import { getReservationClientSecret } from "@/components/sessions/reservationPaymentStorage";
import Button from "@/components/ui/Button";
import { getStudentReservation } from "@/services/studentService";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const formatDateTime = (value?: string) => {
  if (!value) return "Scheduled time pending";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export default function ReservationPaymentPage({
  params,
}: {
  params: { reservationId: string };
}) {
  const reservationId = params.reservationId;
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [storageChecked, setStorageChecked] = useState(false);

  useEffect(() => {
    setClientSecret(getReservationClientSecret(reservationId));
    setStorageChecked(true);
  }, [reservationId]);

  const { data: reservation, isLoading } = useQuery({
    queryKey: ["student-reservations", reservationId],
    queryFn: () => getStudentReservation(reservationId),
    refetchInterval: (query) =>
      query.state.data?.status === "pending" ? 5000 : false,
  });

  const elementsOptions = useMemo(
    () =>
      clientSecret
        ? {
            clientSecret,
            appearance: {
              theme: "stripe" as const,
              variables: {
                borderRadius: "8px",
                colorPrimary: "#0f172a",
              },
            },
          }
        : undefined,
    [clientSecret],
  );

  if (!stripePublishableKey) {
    return (
      <PaymentShell>
        <ErrorPanel
          title="Stripe is not configured"
          message="Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to the frontend environment before taking paid bookings."
        />
      </PaymentShell>
    );
  }

  if (!storageChecked || isLoading) {
    return (
      <PaymentShell>
        <div className="flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white p-8 text-sm font-semibold text-gray-600 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading payment details
        </div>
      </PaymentShell>
    );
  }

  if (reservation?.status === "confirmed") {
    return (
      <PaymentShell>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
          <h2 className="font-heading text-xl font-bold tracking-normal">
            Reservation confirmed
          </h2>
          <p className="mt-2 text-sm leading-6">
            The backend has already confirmed this reservation.
          </p>
          <Button
            type="button"
            className="mt-5"
            onClick={() => {
              window.location.href = `/student/success?reservation=${reservationId}`;
            }}
          >
            Continue
          </Button>
        </div>
      </PaymentShell>
    );
  }

  if (!clientSecret) {
    return (
      <PaymentShell>
        <ErrorPanel
          title="Payment session expired"
          message="For security, payment details are kept only in this browser session. Please book the slot again to create a fresh payment intent."
        />
      </PaymentShell>
    );
  }

  return (
    <PaymentShell>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
                Pending payment
              </p>
              <h1 className="mt-1 font-heading text-2xl font-bold tracking-normal text-gray-950">
                Complete your secure payment
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Your reservation stays pending until Stripe confirms the payment
                and the webhook updates it on the backend.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Elements stripe={stripePromise} options={elementsOptions}>
              <PaymentForm reservationUuid={reservationId} />
            </Elements>
          </div>
        </section>

        <aside className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-400">
            <CalendarCheck className="h-4 w-4" />
            Reservation
          </div>
          <h2 className="mt-3 font-heading text-xl font-bold tracking-normal text-gray-950">
            {reservation?.availability?.session?.title ?? "Session booking"}
          </h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-gray-500">Status</dt>
              <dd className="mt-1 font-bold capitalize text-amber-700">
                {reservation?.status ?? "pending"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-500">Time</dt>
              <dd className="mt-1 font-bold text-gray-900">
                {formatDateTime(reservation?.availability?.scheduled_at)}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-500">Reservation ID</dt>
              <dd className="mt-1 break-all font-mono text-xs text-gray-700">
                {reservationId}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </PaymentShell>
  );
}

function PaymentShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:py-10">
      <div className="mx-auto max-w-5xl">
        {children}
        <Link
          href="/student/sessions"
          className="mt-6 inline-flex text-sm font-semibold text-brand-700 transition hover:text-brand-900"
        >
          Back to sessions
        </Link>
      </div>
    </div>
  );
}

function ErrorPanel({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-1 h-5 w-5 shrink-0" />
        <div>
          <h1 className="font-heading text-xl font-bold tracking-normal">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6">{message}</p>
        </div>
      </div>
    </div>
  );
}
