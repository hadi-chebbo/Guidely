"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  Sparkles,
  TicketCheck,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  getPublicSessions,
  bookSessionAvailability,
  type PublicSessionItem,
  type PublicSessionAvailability,
} from "@/services/studentService";
import { saveReservationClientSecret } from "@/components/sessions/reservationPaymentStorage";

const RESERVATION_STORAGE_PREFIX = "guidely_session_reservation:";

const formatPrice = (price: number | string, currency: string) => {
  const amount = typeof price === "number" ? price : Number(price);

  if (!Number.isFinite(amount)) {
    return `${currency} ${price}`;
  }

  return `${currency} ${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`;
};

const formatSessionType = (type: string) =>
  type.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const isOpenAvailability = (availability: PublicSessionAvailability) =>
  ["available", "open"].includes(availability.status.toLowerCase());

const getOpenAvailabilities = (session: PublicSessionItem) =>
  session.availabilities.filter(isOpenAvailability);

const getStoredReservationUuid = (availability: PublicSessionAvailability | undefined) => {
  if (!availability) return null;
  if (availability.reservation_uuid) return availability.reservation_uuid;
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(`${RESERVATION_STORAGE_PREFIX}${availability.uuid}`);
};

const storeReservationUuid = (availabilityUuid: string, reservationUuid: string | null) => {
  if (typeof window === "undefined") return;
  const key = `${RESERVATION_STORAGE_PREFIX}${availabilityUuid}`;
  if (reservationUuid) {
    window.localStorage.setItem(key, reservationUuid);
  } else {
    window.localStorage.removeItem(key);
  }
};

const formatDateTime = (value: string) => {
  if (!value) return "Time not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

function SessionActionButtons({
  selectedAvailability,
}: {
  selectedAvailability: PublicSessionAvailability | undefined;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [reservationUuid, setReservationUuid] = useState<string | null>(() =>
    getStoredReservationUuid(selectedAvailability),
  );

  useEffect(() => {
    setReservationUuid(getStoredReservationUuid(selectedAvailability));
  }, [selectedAvailability]);

  const refreshSessions = async () => {
    await queryClient.invalidateQueries({ queryKey: ["student-sessions"] });
    await queryClient.invalidateQueries({ queryKey: ["public-mentor-sessions"] });
  };

  const bookMutation = useMutation({
    mutationFn: () => {
      if (!selectedAvailability?.uuid) {
        throw new Error("Choose an open time before booking.");
      }
      return bookSessionAvailability(selectedAvailability.uuid);
    },
    onSuccess: async (response) => {
      setReservationUuid(response.reservation.uuid);
      if (selectedAvailability?.uuid) {
        storeReservationUuid(selectedAvailability.uuid, response.reservation.uuid);
      }
      await refreshSessions();

      if (response.client_secret) {
        saveReservationClientSecret(response.reservation.uuid, response.client_secret);
        toast.message("Payment is required to confirm this reservation.");
        router.push(`/student/payment/${response.reservation.uuid}`);
        return;
      }

      toast.success("Reservation confirmed.");
      router.push(`/student/success?reservation=${response.reservation.uuid}`);
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Session could not be booked.",
      );
    },
  });

  const hasAvailability = Boolean(selectedAvailability?.uuid);
  const isReserved = Boolean(reservationUuid);

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        size="md"
        fullWidth
        disabled={!hasAvailability || bookMutation.isPending}
        isLoading={bookMutation.isPending}
        leftIcon={
          isReserved ? (
            <CalendarCheck className="h-4 w-4" />
          ) : (
            <TicketCheck className="h-4 w-4" />
          )
        }
        onClick={() => {
          if (isReserved) {
            router.push("/student/reservations");
            return;
          }
          bookMutation.mutate();
        }}
        className="rounded-lg"
      >
        {isReserved ? "View Booking" : hasAvailability ? "Book Selected Time" : "Choose a Time"}
      </Button>
    </div>
  );
}

function SessionCard({
  session,
  recommended = false,
}: {
  session: PublicSessionItem;
  recommended?: boolean;
}) {
  const openAvailabilities = getOpenAvailabilities(session);
  const [selectedAvailabilityUuid, setSelectedAvailabilityUuid] = useState(
    openAvailabilities[0]?.uuid ?? "",
  );
  const selectedAvailability =
    openAvailabilities.find((availability) => availability.uuid === selectedAvailabilityUuid) ??
    openAvailabilities[0];

  useEffect(() => {
    setSelectedAvailabilityUuid((current) => {
      if (openAvailabilities.some((availability) => availability.uuid === current)) {
        return current;
      }

      return openAvailabilities[0]?.uuid ?? "";
    });
  }, [openAvailabilities]);

  return (
    <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={recommended ? "brand" : "outline"} size="md">
              {formatSessionType(session.type)}
            </Badge>
            {recommended && (
              <Badge
                variant="success"
                size="md"
                leftIcon={<Sparkles className="h-3.5 w-3.5" />}
              >
                Recommended
              </Badge>
            )}
          </div>
          <h3 className="mt-4 line-clamp-2 font-heading text-xl font-bold tracking-normal text-gray-950">
            {session.title}
          </h3>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <CalendarCheck className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
        {session.description}
      </p>

      <div className="mt-5 grid gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm sm:grid-cols-3">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <Clock3 className="h-3.5 w-3.5" />
            Duration
          </p>
          <p className="mt-1 font-bold text-gray-900">
            {session.duration_minutes} min
          </p>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <CreditCard className="h-3.5 w-3.5" />
            Price
          </p>
          <p className="mt-1 font-bold text-gray-900">
            {formatPrice(session.price, session.currency)}
          </p>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <CalendarCheck className="h-3.5 w-3.5" />
            Slots
          </p>
          <p className="mt-1 font-bold text-gray-900">{openAvailabilities.length}</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-100 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Choose an open time
        </p>
        {openAvailabilities.length ? (
          <div className="mt-3 space-y-2">
            {openAvailabilities.map((availability) => {
              const isSelected = availability.uuid === selectedAvailability?.uuid;

              return (
              <button
                type="button"
                key={availability.uuid}
                onClick={() => setSelectedAvailabilityUuid(availability.uuid)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "border-brand-300 bg-brand-50 text-brand-950 ring-2 ring-brand-100"
                    : "border-gray-100 bg-gray-50 text-gray-800 hover:border-brand-100 hover:bg-white"
                }`}
                aria-pressed={isSelected}
              >
                <span className="font-semibold text-gray-800">
                  {formatDateTime(availability.scheduled_at)}
                </span>
                <Badge variant={isSelected ? "brand" : "success"} size="sm">
                  {isSelected ? "Selected" : "Open"}
                </Badge>
              </button>
              );
            })}
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-500">No open slots right now.</p>
        )}
        {selectedAvailability && (
          <div className="mt-3 rounded-lg border border-brand-100 bg-brand-50 px-3 py-2 text-sm">
            <span className="font-semibold text-brand-900">Selected time: </span>
            <span className="font-bold text-brand-950">
              {formatDateTime(selectedAvailability.scheduled_at)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-auto pt-5">
        <SessionActionButtons selectedAvailability={selectedAvailability} />
      </div>
    </article>
  );
}

function SessionsGrid({
  sessions,
  recommended = false,
}: {
  sessions: PublicSessionItem[];
  recommended?: boolean;
}) {
  if (!sessions.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
        <CalendarCheck className="mx-auto h-10 w-10 text-gray-300" />
        <h3 className="mt-3 text-base font-bold text-gray-900">
          No sessions available
        </h3>
        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-gray-500">
          New mentor sessions will appear here when mentors publish available
          time slots.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sessions.map((session) => (
        <SessionCard
          key={session.slug}
          session={session}
          recommended={recommended}
        />
      ))}
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-80 animate-pulse rounded-xl border border-gray-100 bg-white shadow-sm"
        />
      ))}
    </div>
  );
}

export default function StudentSessionsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["student-sessions", page],
    queryFn: () => getPublicSessions({ page, per_page: 10 }),
  });

  const recommended = data?.recommended ?? [];
  const allSessions = data?.sessions.data ?? [];
  const pagination = data?.sessions.pagination;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100">
      <section className="border-b border-white/20 bg-brand-950 px-4 py-10 text-white sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/75">
            <CalendarCheck className="h-3.5 w-3.5" />
            Mentor sessions
          </span>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-3xl font-heading text-3xl font-extrabold tracking-normal sm:text-5xl">
                Book guidance sessions that fit your next decision.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">
                Browse recommended sessions and upcoming mentor availability in
                one place.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <button
                type="button"
                onClick={() => router.push("/student/reservations")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-brand-950 transition hover:bg-brand-50"
              >
                <CalendarCheck className="h-4 w-4" />
                View my booked sessions
              </button>
              {pagination && (
                <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/80">
                  <span className="font-bold text-white">{pagination.total}</span>{" "}
                  total session{pagination.total === 1 ? "" : "s"}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
        {isError ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
            <h2 className="text-lg font-bold text-red-800">
              Sessions could not be loaded
            </h2>
            <p className="mt-2 text-sm text-red-700">
              Please try again. If the issue continues, check your connection or
              sign in again.
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
        ) : (
          <>
            <section className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
                    Recommended Sessions
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-bold tracking-normal text-gray-950">
                    Matched to your guidance profile
                  </h2>
                </div>
                {!isLoading && (
                  <p className="text-sm font-medium text-gray-500">
                    {recommended.length} recommendation
                    {recommended.length === 1 ? "" : "s"}
                  </p>
                )}
              </div>
              {isLoading ? (
                <LoadingGrid />
              ) : (
                <SessionsGrid sessions={recommended} recommended />
              )}
            </section>

            <section className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
                    All Sessions
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-bold tracking-normal text-gray-950">
                    Explore every available mentor session
                  </h2>
                </div>
                {pagination && (
                  <p className="text-sm font-medium text-gray-500">
                    Page {pagination.current_page} of {pagination.last_page}
                  </p>
                )}
              </div>
              {isLoading ? (
                <LoadingGrid />
              ) : (
                <>
                  <SessionsGrid sessions={allSessions} />
                  {pagination && pagination.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                        disabled={isFetching || pagination.current_page <= 1}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                      </button>
                      <span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm">
                        Page {pagination.current_page} of {pagination.last_page}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setPage((current) =>
                            Math.min(pagination.last_page, current + 1),
                          )
                        }
                        disabled={
                          isFetching || pagination.current_page >= pagination.last_page
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
