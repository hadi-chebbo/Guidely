"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarCheck,
  Clock3,
  CreditCard,
  ExternalLink,
  GraduationCap,
  Languages,
  Loader2,
  School,
  TicketCheck,
  UserRound,
  XCircle,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  getPublicMentor,
  getPublicMentorSessions,
  bookSessionAvailability,
  cancelReservation,
  type PublicMentorItem,
  type PublicSessionItem,
  type PublicSessionAvailability,
} from "@/services/studentService";

const RESERVATION_STORAGE_PREFIX = "guidely_session_reservation:";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatLanguages = (languages: PublicMentorItem["profile"] extends infer P
  ? P extends { languages?: infer L }
    ? L
    : unknown
  : unknown) => {
  if (Array.isArray(languages)) return languages.join(", ");
  if (typeof languages === "string") return languages;
  return null;
};

const formatPrice = (price: number | string, currency: string) => {
  const amount = typeof price === "number" ? price : Number(price);
  return Number.isFinite(amount)
    ? `${currency} ${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`
    : `${currency} ${price}`;
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return value || "Time not set";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getAvailableSlot = (session: PublicSessionItem) =>
  session.availabilities.find((availability) =>
    ["available", "open"].includes(availability.status.toLowerCase()),
  ) ?? session.availabilities[0];

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

function Avatar({ mentor }: { mentor: PublicMentorItem }) {
  if (mentor.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={mentor.avatar_url}
        alt={mentor.name}
        className="h-24 w-24 rounded-lg border border-white bg-white object-cover shadow-sm"
      />
    );
  }

  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-brand-950 text-2xl font-bold text-white shadow-sm">
      {initials(mentor.name)}
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  if (!value) return null;

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function SessionActions({ session }: { session: PublicSessionItem }) {
  const queryClient = useQueryClient();
  const availableSlot = getAvailableSlot(session);
  const [reservationUuid, setReservationUuid] = useState<string | null>(() =>
    getStoredReservationUuid(availableSlot),
  );
  const hasAvailability = Boolean(availableSlot?.uuid);

  const refreshSessions = async () => {
    await queryClient.invalidateQueries({ queryKey: ["student-sessions"] });
    await queryClient.invalidateQueries({ queryKey: ["public-mentor-sessions"] });
  };

  const bookMutation = useMutation({
    mutationFn: () => {
      if (!availableSlot?.uuid) {
        throw new Error("No available slot to book.");
      }
      return bookSessionAvailability(availableSlot.uuid);
    },
    onSuccess: async (response) => {
      setReservationUuid(response.reservation.uuid);
      if (availableSlot?.uuid) {
        storeReservationUuid(availableSlot.uuid, response.reservation.uuid);
      }
      toast.success(
        response.client_secret
          ? "Payment is required to confirm this reservation."
          : "Reservation confirmed.",
      );
      await refreshSessions();
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Session could not be booked.",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => {
      if (!reservationUuid) {
        throw new Error("Book this session before cancelling it.");
      }
      return cancelReservation(reservationUuid);
    },
    onSuccess: async () => {
      setReservationUuid(null);
      if (availableSlot?.uuid) {
        storeReservationUuid(availableSlot.uuid, null);
      }
      toast.success("Reservation cancelled successfully.");
      await refreshSessions();
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Reservation could not be cancelled.",
      );
    },
  });

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Button
        type="button"
        size="md"
        fullWidth
        disabled={
          !hasAvailability ||
          Boolean(reservationUuid) ||
          bookMutation.isPending ||
          cancelMutation.isPending
        }
        isLoading={bookMutation.isPending}
        leftIcon={<TicketCheck className="h-4 w-4" />}
        onClick={() => bookMutation.mutate()}
        className="rounded-lg"
      >
        {reservationUuid ? "Booked" : "Book Session"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="md"
        fullWidth
        disabled={!reservationUuid || bookMutation.isPending || cancelMutation.isPending}
        isLoading={cancelMutation.isPending}
        leftIcon={<XCircle className="h-4 w-4" />}
        onClick={() => cancelMutation.mutate()}
        className="rounded-lg border-gray-300"
      >
        Cancel Booking
      </Button>
    </div>
  );
}

function MentorSessionCard({ session }: { session: PublicSessionItem }) {
  const nextSlot = session.availabilities[0];

  return (
    <article className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Badge variant="brand" size="md">
            {session.type}
          </Badge>
          <h3 className="mt-3 line-clamp-2 text-lg font-bold text-gray-950">
            {session.title}
          </h3>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <CalendarCheck className="h-5 w-5" />
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
        {session.description}
      </p>

      <div className="mt-4 grid gap-3 rounded-lg bg-gray-50 p-3 text-sm sm:grid-cols-3">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <Clock3 className="h-3.5 w-3.5" />
            Duration
          </p>
          <p className="mt-1 font-bold text-gray-900">{session.duration_minutes} min</p>
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
          <p className="mt-1 font-bold text-gray-900">{session.availabilities_count}</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-100 p-3 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Next slot
        </p>
        <p className="mt-1 font-semibold text-gray-900">
          {nextSlot ? formatDateTime(nextSlot.scheduled_at) : "No open slots right now"}
        </p>
      </div>

      <div className="mt-5">
        <SessionActions session={session} />
      </div>
    </article>
  );
}

export default function StudentMentorDetailsPage() {
  const params = useParams<{ username: string }>();
  const username = decodeURIComponent(params.username);

  const {
    data: mentor,
    isFetching: mentorLoading,
    isError: mentorError,
  } = useQuery({
    queryKey: ["public-mentor", username],
    queryFn: () => getPublicMentor(username),
    enabled: Boolean(username),
    retry: false,
  });

  const {
    data: sessions = [],
    isFetching: sessionsLoading,
    isError: sessionsError,
  } = useQuery({
    queryKey: ["public-mentor-sessions", username],
    queryFn: () => getPublicMentorSessions(username),
    enabled: Boolean(username),
    retry: false,
  });

  const profile = mentor?.profile;
  const languages = formatLanguages(profile?.languages);
  const majorName = profile?.major?.name_en ?? profile?.major?.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100">
      <section className="bg-brand-950 px-4 py-10 text-white sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/student/mentors"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to mentors
          </Link>

          {mentorLoading ? (
            <div className="mt-8 flex min-h-48 items-center text-white/75">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading mentor...
            </div>
          ) : mentorError || !mentor ? (
            <div className="mt-8 rounded-lg border border-red-300/30 bg-red-500/10 p-5 text-sm font-semibold text-red-50">
              Mentor profile could not be loaded.
            </div>
          ) : (
            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <Avatar mentor={mentor} />
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    {profile?.is_accepting_students && (
                      <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-100 ring-1 ring-emerald-300/25">
                        Accepting students
                      </span>
                    )}
                    {mentor.preferred_language && (
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/75 ring-1 ring-white/15">
                        {mentor.preferred_language}
                      </span>
                    )}
                  </div>
                  <h1 className="mt-3 text-3xl font-extrabold tracking-normal sm:text-5xl">
                    {mentor.name}
                  </h1>
                  <p className="mt-1 text-white/60">@{mentor.username}</p>
                </div>
              </div>

              <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/80">
                <span className="font-bold text-white">{sessions.length}</span>{" "}
                active session{sessions.length === 1 ? "" : "s"}
              </div>
            </div>
          )}
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-6">
          {mentor && (
            <>
              {profile?.bio && (
                <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-950">About</h2>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{profile.bio}</p>
                </div>
              )}

              <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
                      Sessions
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-gray-950">
                      Available with this mentor
                    </h2>
                  </div>
                </div>

                {sessionsLoading ? (
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-72 animate-pulse rounded-lg bg-gray-100"
                      />
                    ))}
                  </div>
                ) : sessionsError ? (
                  <div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-700">
                    Sessions could not be loaded for this mentor.
                  </div>
                ) : sessions.length ? (
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {sessions.map((session) => (
                      <MentorSessionCard key={session.slug} session={session} />
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                    <CalendarCheck className="mx-auto h-10 w-10 text-gray-300" />
                    <h3 className="mt-3 text-base font-bold text-gray-900">
                      No sessions yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This mentor does not have future available sessions right now.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        {mentor && (
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="grid gap-3">
              <InfoTile icon={GraduationCap} label="Major" value={majorName} />
              <InfoTile icon={School} label="University" value={profile?.university_name ?? mentor.school} />
              <InfoTile icon={UserRound} label="Experience" value={profile?.years_experience ? `${profile.years_experience} years` : null} />
              <InfoTile icon={Languages} label="Languages" value={languages} />
            </div>

            {(profile?.degree || profile?.graduation_year) && (
              <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Education
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {[profile.degree, profile.graduation_year].filter(Boolean).join(" - ")}
                </p>
              </div>
            )}

            {(profile?.social_links?.linkedin || profile?.social_links?.website) && (
              <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Links
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.social_links.linkedin && (
                    <a
                      href={profile.social_links.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-950 px-4 text-sm font-bold text-white transition hover:bg-brand-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                  {profile.social_links.website && (
                    <a
                      href={profile.social_links.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            )}
          </aside>
        )}
      </main>
    </div>
  );
}
