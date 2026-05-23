"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  Loader2,
  RefreshCw,
  UserRound,
  XCircle,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  cancelReservation,
  getStudentReservations,
  type StudentReservationsResponse,
  type ReservationSummary,
} from "@/services/studentService";

const RESERVATION_STORAGE_PREFIX = "guidely_session_reservation:";

const formatDateTime = (value?: string | null) => {
  if (!value) return "Scheduled time pending";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatPrice = (price?: number | string, currency = "USD") => {
  if (price === undefined || price === null) return "Price pending";

  const amount = typeof price === "number" ? price : Number(price);
  return Number.isFinite(amount)
    ? `${currency} ${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`
    : `${currency} ${price}`;
};

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "success" as const;
    case "pending":
      return "warning" as const;
    case "cancelled":
      return "danger" as const;
    case "completed":
      return "info" as const;
    default:
      return "outline" as const;
  }
};

const clearStoredReservation = (reservation: ReservationSummary) => {
  if (typeof window === "undefined") return;

  const availabilityUuid = reservation.availability?.uuid;
  if (!availabilityUuid) return;

  window.localStorage.removeItem(`${RESERVATION_STORAGE_PREFIX}${availabilityUuid}`);
};

const isVisibleBooking = (reservation: ReservationSummary) =>
  !["cancelled", "completed"].includes(reservation.status.toLowerCase());

function ReservationCard({ reservation }: { reservation: ReservationSummary }) {
  const queryClient = useQueryClient();
  const session = reservation.availability?.session;
  const mentor = session?.mentor;
  const canCancel = !["cancelled", "completed"].includes(
    reservation.status.toLowerCase(),
  );

  const cancelMutation = useMutation({
    mutationFn: () => cancelReservation(reservation.uuid),
    onSuccess: async () => {
      clearStoredReservation(reservation);
      toast.success("Reservation cancelled successfully.");
      queryClient.setQueriesData<StudentReservationsResponse>(
        { queryKey: ["student-reservations"] },
        (current) =>
          current
            ? {
                ...current,
                data: current.data.filter((item) => item.uuid !== reservation.uuid),
                meta: {
                  ...current.meta,
                  total: Math.max(0, current.meta.total - 1),
                },
              }
            : current,
      );
      await queryClient.invalidateQueries({ queryKey: ["student-reservations"] });
      await queryClient.invalidateQueries({ queryKey: ["student-sessions"] });
      await queryClient.invalidateQueries({ queryKey: ["public-mentor-sessions"] });
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Reservation could not be cancelled.",
      );
    },
  });

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getStatusVariant(reservation.status)} size="md">
              {reservation.status}
            </Badge>
            {session?.type && (
              <Badge variant="outline" size="md">
                {session.type.replaceAll("-", " ")}
              </Badge>
            )}
          </div>

          <h2 className="mt-3 font-heading text-xl font-bold tracking-normal text-gray-950">
            {session?.title ?? "Mentor session"}
          </h2>
          {session?.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
              {session.description}
            </p>
          )}
        </div>

        <Button
          type="button"
          variant="danger"
          size="md"
          fullWidth={false}
          disabled={!canCancel}
          isLoading={cancelMutation.isPending}
          leftIcon={<XCircle className="h-4 w-4" />}
          onClick={() => cancelMutation.mutate()}
          className="w-full rounded-lg lg:w-auto"
        >
          Cancel booking
        </Button>
      </div>

      <dl className="mt-5 grid gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm md:grid-cols-4">
        <div>
          <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <Clock3 className="h-3.5 w-3.5" />
            Time
          </dt>
          <dd className="mt-1 font-bold text-gray-900">
            {formatDateTime(reservation.availability?.scheduled_at)}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <CalendarCheck className="h-3.5 w-3.5" />
            Ends
          </dt>
          <dd className="mt-1 font-bold text-gray-900">
            {formatDateTime(reservation.availability?.ends_at)}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <CreditCard className="h-3.5 w-3.5" />
            Price
          </dt>
          <dd className="mt-1 font-bold text-gray-900">
            {formatPrice(session?.price, session?.currency)}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <UserRound className="h-3.5 w-3.5" />
            Mentor
          </dt>
          <dd className="mt-1 font-bold text-gray-900">
            {mentor?.username ? (
              <Link
                href={`/student/mentors/${mentor.username}`}
                className="text-brand-700 transition hover:text-brand-900"
              >
                {mentor.name ?? mentor.username}
              </Link>
            ) : (
              mentor?.name ?? "Mentor pending"
            )}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export default function StudentReservationsPage() {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["student-reservations", page],
    queryFn: () => getStudentReservations({ page, per_page: 10 }),
  });

  const reservations = (data?.data ?? []).filter(isVisibleBooking);
  const meta = data?.meta;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100">
      <section className="border-b border-white/20 bg-brand-950 px-4 py-10 text-white sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/75">
            <CalendarCheck className="h-3.5 w-3.5" />
            My booked sessions
          </span>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-3xl font-heading text-3xl font-extrabold tracking-normal sm:text-5xl">
                Manage the sessions you reserved.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">
                Review your mentor sessions and cancel reservations from this
                page.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-brand-700" />
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-center">
            <h2 className="text-lg font-bold text-red-800">
              Bookings could not be loaded
            </h2>
            <p className="mt-2 text-sm text-red-700">
              Please try again. If the issue continues, sign in again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              {isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Try again
            </button>
          </div>
        ) : reservations.length ? (
          <>
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <ReservationCard key={reservation.uuid} reservation={reservation} />
              ))}
            </div>

            {meta && meta.last_page > 1 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={isFetching || meta.current_page <= 1}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm">
                  Page {meta.current_page} of {meta.last_page}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.min(meta.last_page, current + 1))
                  }
                  disabled={isFetching || meta.current_page >= meta.last_page}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
            <CalendarCheck className="mx-auto h-10 w-10 text-gray-300" />
            <h2 className="mt-3 text-lg font-bold text-gray-950">
              No booked sessions yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Once you reserve a mentor session, it will appear here.
            </p>
            <Link
              href="/student/sessions"
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-brand-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Browse sessions
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
