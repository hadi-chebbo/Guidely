"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, CheckCircle2, Clock3, Loader2 } from "lucide-react";

import Button from "@/components/ui/Button";
import { getStudentReservation } from "@/services/studentService";

const formatDateTime = (value?: string) => {
  if (!value) return "Scheduled time pending";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
};

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
          <section className="mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <Loader2 className="mx-auto h-7 w-7 animate-spin text-brand-700" />
            <p className="mt-4 text-sm font-semibold text-gray-600">
              Loading booking status
            </p>
          </section>
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservation");
  const startsPending = searchParams.get("pending") === "1";

  const { data: reservation, isLoading } = useQuery({
    queryKey: ["student-reservations", reservationId],
    queryFn: () => getStudentReservation(reservationId ?? ""),
    enabled: Boolean(reservationId),
    refetchInterval: (query) =>
      query.state.data?.status === "confirmed" ? false : 3000,
  });

  const isConfirmed = reservation?.status === "confirmed";
  const isPending = startsPending || reservation?.status === "pending";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            isConfirmed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}
        >
          {isLoading || isPending ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : (
            <CheckCircle2 className="h-7 w-7" />
          )}
        </div>

        <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-600">
          Booking status
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-normal text-gray-950">
          {isConfirmed ? "Reservation confirmed" : "Confirmation in progress"}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600">
          {isConfirmed
            ? "Your session is confirmed by the backend. A reminder email will be scheduled automatically."
            : "Payment may already be complete. This page is checking the backend until the Stripe webhook marks your reservation confirmed."}
        </p>

        {reservation && (
          <dl className="mt-8 grid gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 text-left text-sm sm:grid-cols-2">
            <div>
              <dt className="flex items-center gap-2 font-semibold text-gray-500">
                <CalendarCheck className="h-4 w-4" />
                Session
              </dt>
              <dd className="mt-1 font-bold text-gray-900">
                {reservation.availability?.session?.title ?? "Mentor session"}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 font-semibold text-gray-500">
                <Clock3 className="h-4 w-4" />
                Time
              </dt>
              <dd className="mt-1 font-bold text-gray-900">
                {formatDateTime(reservation.availability?.scheduled_at)}
              </dd>
            </div>
          </dl>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/student/sessions" className="w-full sm:w-auto">
            <Button type="button" fullWidth>
              View sessions
            </Button>
          </Link>
          <Link href="/student/dashboard" className="w-full sm:w-auto">
            <Button type="button" variant="ghost" fullWidth>
              Dashboard
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
