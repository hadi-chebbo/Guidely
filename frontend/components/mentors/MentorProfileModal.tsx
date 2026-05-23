"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ExternalLink,
  GraduationCap,
  Languages,
  Loader2,
  School,
  UserRound,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import {
  getPublicMentor,
  type PublicMentorItem,
} from "@/services/studentService";

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

function Avatar({ mentor, size = "lg" }: { mentor: PublicMentorItem; size?: "md" | "lg" }) {
  const [imageFailed, setImageFailed] = useState(false);
  const className =
    size === "lg"
      ? "h-20 w-20 text-xl"
      : "h-11 w-11 text-sm";

  if (mentor.avatar_url && !imageFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={mentor.avatar_url}
        alt={mentor.name}
        onError={() => setImageFailed(true)}
        className={`${className} rounded-lg border border-white bg-white object-cover shadow-sm`}
      />
    );
  }

  return (
    <div className={`${className} flex items-center justify-center rounded-lg bg-brand-950 font-bold text-white shadow-sm`}>
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
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}

export function MentorCard({
  mentor,
  onView,
}: {
  mentor: PublicMentorItem;
  onView: (username: string) => void;
}) {
  const profile = mentor.profile;
  const majorName = profile?.major?.name_en ?? profile?.major?.name;

  return (
    <article className="flex h-full flex-col rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
      <div className="flex items-start gap-3">
        <Avatar mentor={mentor} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 font-bold text-gray-900">{mentor.name}</h3>
          <p className="text-xs text-gray-400">@{mentor.username}</p>
        </div>
        {profile?.is_accepting_students && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
            Available
          </span>
        )}
      </div>

      <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-gray-500">
        {profile?.bio || "Approved Guidely mentor ready to help students understand this path."}
      </p>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        {majorName && (
          <p className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-brand-500" />
            <span className="line-clamp-1">{majorName}</span>
          </p>
        )}
        {(profile?.university_name || mentor.school) && (
          <p className="flex items-center gap-2">
            <School className="h-4 w-4 text-emerald-500" />
            <span className="line-clamp-1">{profile?.university_name ?? mentor.school}</span>
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onView(mentor.username)}
        className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        View mentor
        <ExternalLink className="h-3.5 w-3.5" />
      </button>
    </article>
  );
}

export default function MentorProfileModal({
  username,
  onClose,
}: {
  username: string | null;
  onClose: () => void;
}) {
  const { data: mentor, isFetching, isError } = useQuery({
    queryKey: ["public-mentor", username],
    queryFn: () => getPublicMentor(username as string),
    enabled: Boolean(username),
    retry: false,
  });

  const profile = mentor?.profile;
  const languages = formatLanguages(profile?.languages);
  const majorName = profile?.major?.name_en ?? profile?.major?.name;

  return (
    <Modal
      open={Boolean(username)}
      onClose={onClose}
      size="xl"
      title={mentor?.name ?? "Mentor profile"}
      description={mentor ? `@${mentor.username}` : undefined}
    >
      {isFetching ? (
        <div className="flex min-h-64 items-center justify-center text-sm text-gray-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-brand-600" />
          Loading mentor profile...
        </div>
      ) : isError || !mentor ? (
        <div className="rounded-lg border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-700">
          Mentor profile could not be loaded. Please try again.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-5 rounded-lg bg-gradient-to-br from-brand-50 to-white p-5 sm:flex-row sm:items-center">
            <Avatar mentor={mentor} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                {profile?.is_accepting_students && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                    Accepting students
                  </span>
                )}
                {mentor.preferred_language && (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-600 ring-1 ring-gray-100">
                    {mentor.preferred_language}
                  </span>
                )}
              </div>
              <h2 className="mt-3 text-2xl font-extrabold text-gray-900">
                {mentor.name}
              </h2>
              <p className="text-sm text-gray-500">@{mentor.username}</p>
              {profile?.bio && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoTile icon={GraduationCap} label="Major" value={majorName} />
            <InfoTile icon={School} label="University" value={profile?.university_name ?? mentor.school} />
            <InfoTile icon={UserRound} label="Experience" value={profile?.years_experience ? `${profile.years_experience} years` : null} />
            <InfoTile icon={Languages} label="Languages" value={languages} />
          </div>

          {(profile?.degree || profile?.graduation_year) && (
            <div className="rounded-lg border border-gray-100 bg-white p-4">
              <h3 className="text-sm font-bold uppercase text-gray-400">
                Education
              </h3>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {[profile.degree, profile.graduation_year].filter(Boolean).join(" • ")}
              </p>
            </div>
          )}

          {(profile?.social_links?.linkedin || profile?.social_links?.website) && (
            <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
              {profile.social_links.linkedin && (
                <a
                  href={profile.social_links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-950 px-4 text-sm font-bold text-white shadow-brand transition hover:bg-brand-700"
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
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  <ExternalLink className="h-4 w-4" />
                  Website
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
