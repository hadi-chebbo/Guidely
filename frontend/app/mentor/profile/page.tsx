"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Save, UserRoundCog } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { AdminCard, AdminPageHeader, AdminPageShell } from "@/components/admin/AdminPage";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Switch from "@/components/ui/Switch";
import Textarea from "@/components/ui/Textarea";
import { getPublicMajors } from "@/services/studentService";
import { mentorService, type MentorProfilePayload } from "@/services/mentorService";

const currentYear = new Date().getFullYear();

const defaultForm: MentorProfilePayload = {
  major_slug: "",
  is_accepting_students: true,
  bio: "",
  years_experience: 0,
  degree: "",
  university_name: "",
  graduation_year: currentYear,
  languages: ["English"],
  linkedin_url: "",
  website_url: "",
};

const getProfileCacheKey = (username: string) => `mentor_profile:${username}`;

const readCachedProfile = (username?: string): MentorProfilePayload | null => {
  if (!username || typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(getProfileCacheKey(username));
    return raw ? (JSON.parse(raw) as MentorProfilePayload) : null;
  } catch {
    return null;
  }
};

const writeCachedProfile = (username: string | undefined, profile: MentorProfilePayload) => {
  if (!username || typeof window === "undefined") return;
  window.localStorage.setItem(getProfileCacheKey(username), JSON.stringify(profile));
};

export default function MentorProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState<MentorProfilePayload>(defaultForm);
  const [languageText, setLanguageText] = useState("English");
  const [hasHydratedProfile, setHasHydratedProfile] = useState(false);
  const username = user?.username;

  const { data: majorsData, isLoading: majorsLoading } = useQuery({
    queryKey: ["mentor-profile-majors"],
    queryFn: () => getPublicMajors({ per_page: 100, page: 1 }),
  });

  const {
    data: existingProfile,
    isLoading: profileLoading,
    isError: profileError,
    isSuccess: profileLoaded,
  } = useQuery({
    queryKey: ["mentor-profile", username],
    queryFn: () => mentorService.getProfileByUsername(username as string),
    enabled: Boolean(username),
    retry: false,
  });

  useEffect(() => {
    if (hasHydratedProfile) return;

    const cachedProfile = readCachedProfile(username);
    if (!cachedProfile) return;

    setForm(cachedProfile);
    setLanguageText(cachedProfile.languages.join(", "));
    setHasHydratedProfile(true);
  }, [hasHydratedProfile, username]);

  useEffect(() => {
    if (!existingProfile) return;

    const nextProfile = {
      major_slug: existingProfile.major_slug,
      is_accepting_students: existingProfile.is_accepting_students,
      bio: existingProfile.bio,
      years_experience: existingProfile.years_experience,
      degree: existingProfile.degree,
      university_name: existingProfile.university_name,
      graduation_year: existingProfile.graduation_year,
      languages: existingProfile.languages,
      linkedin_url: existingProfile.linkedin_url ?? "",
      website_url: existingProfile.website_url ?? "",
    };

    setForm(nextProfile);
    setLanguageText(existingProfile.languages.join(", "));
    setHasHydratedProfile(true);
    writeCachedProfile(username, nextProfile);
  }, [existingProfile, username]);

  const majorOptions = useMemo(() => {
    const majors = [
      ...(majorsData?.recommended ?? []),
      ...(majorsData?.featured ?? []),
      ...(majorsData?.others.data ?? []),
    ];
    const seen = new Set<string>();

    return majors
      .filter((major) => {
        if (!major.slug || seen.has(major.slug)) return false;
        seen.add(major.slug);
        return true;
      })
      .map((major) => ({ value: major.slug, label: major.name_en }));
  }, [majorsData]);

  const updateProfile = useMutation({
    mutationFn: async (payload: MentorProfilePayload) => {
      try {
        return await mentorService.updateProfile(payload);
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message ?? "";

        if (status === 404 && message.toLowerCase().includes("mentor profile not found")) {
          return mentorService.createProfile(payload);
        }

        throw error;
      }
    },
    onSuccess: (savedProfile) => {
      const nextProfile = {
        major_slug: savedProfile.major_slug,
        is_accepting_students: savedProfile.is_accepting_students,
        bio: savedProfile.bio,
        years_experience: savedProfile.years_experience,
        degree: savedProfile.degree,
        university_name: savedProfile.university_name,
        graduation_year: savedProfile.graduation_year,
        languages: savedProfile.languages,
        linkedin_url: savedProfile.linkedin_url ?? "",
        website_url: savedProfile.website_url ?? "",
      };

      setForm(nextProfile);
      setLanguageText(savedProfile.languages.join(", "));
      setHasHydratedProfile(true);
      writeCachedProfile(username, nextProfile);
      toast.success(savedProfile.status === "pending" ? "Mentor profile created and sent for approval." : "Mentor profile updated.");
    },
    onError: () => {
      toast.error("Profile could not be updated. Check the required fields.");
    },
  });

  const setField = <K extends keyof MentorProfilePayload>(key: K, value: MentorProfilePayload[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const languages = languageText
      .split(",")
      .map((language) => language.trim())
      .filter(Boolean);

    updateProfile.mutate({
      ...form,
      years_experience: Number(form.years_experience),
      graduation_year: Number(form.graduation_year),
      languages,
      linkedin_url: form.linkedin_url || null,
      website_url: form.website_url || null,
    });
  };

  const canShowForm =
    hasHydratedProfile ||
    profileLoaded ||
    Boolean(readCachedProfile(username));

  const profileCannotLoad =
    Boolean(username) &&
    !profileLoading &&
    profileError &&
    !canShowForm;

  return (
    <AdminPageShell>
      <AdminPageHeader
        eyebrow="Mentor profile"
        title="Profile"
        description="Review your existing public mentor profile, update the details, then save the changes."
      />

      {!username && (
        <AdminCard className="border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3 text-sm text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Your login response does not include a username, so the existing mentor profile cannot be loaded.
              Please log in again after the API returns `username` with the user object.
            </p>
          </div>
        </AdminCard>
      )}

      {profileCannotLoad && (
        <AdminCard className="border-red-200 bg-red-50 p-6">
          <div className="flex gap-3 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Existing mentor profile could not be loaded.</p>
              <p className="mt-1 leading-6">
                The page will not open an empty edit form because the old profile must come first from
                `GET /mentors/{username}`. Please make sure this endpoint returns the mentor profile for the logged-in
                mentor user.
              </p>
            </div>
          </div>
        </AdminCard>
      )}

      {profileLoading && !hasHydratedProfile && (
        <AdminCard className="p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
          <div className="mt-5 h-40 animate-pulse rounded-lg bg-gray-100" />
        </AdminCard>
      )}

      {canShowForm && (
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <AdminCard className="p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Select
              label="Major expertise"
              placeholder={majorsLoading ? "Loading majors..." : "Select a major"}
              value={form.major_slug}
              onChange={(event) => setField("major_slug", event.target.value)}
              options={majorOptions}
              required
              disabled={majorsLoading}
            />
            <Input
              label="Degree"
              value={form.degree}
              onChange={(event) => setField("degree", event.target.value)}
              placeholder="BS Computer Science"
              required
            />
            <Input
              label="University"
              value={form.university_name}
              onChange={(event) => setField("university_name", event.target.value)}
              placeholder="Lebanese American University"
              required
            />
            <Input
              label="Graduation year"
              type="number"
              min={1900}
              max={currentYear + 10}
              value={form.graduation_year}
              onChange={(event) => setField("graduation_year", Number(event.target.value))}
              required
            />
            <Input
              label="Years of experience"
              type="number"
              min={0}
              max={80}
              value={form.years_experience}
              onChange={(event) => setField("years_experience", Number(event.target.value))}
              required
            />
            <Input
              label="Languages"
              value={languageText}
              onChange={(event) => setLanguageText(event.target.value)}
              hint="Separate languages with commas."
              placeholder="English, Arabic, French"
              required
            />
            <Input
              label="LinkedIn URL"
              type="url"
              value={form.linkedin_url ?? ""}
              onChange={(event) => setField("linkedin_url", event.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
            <Input
              label="Website URL"
              type="url"
              value={form.website_url ?? ""}
              onChange={(event) => setField("website_url", event.target.value)}
              placeholder="https://your-site.com"
            />
          </div>

          <div className="mt-5">
            <Textarea
              label="Mentor bio"
              value={form.bio}
              onChange={(event) => setField("bio", event.target.value)}
              rows={8}
              maxLength={5000}
              placeholder="Share what you studied, what students usually ask you, and how you help them make clearer decisions."
              required
            />
          </div>
        </AdminCard>

        <div className="space-y-6">
          <AdminCard className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-brand-50 p-2.5 text-brand-700">
                <UserRoundCog className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-semibold text-gray-900">Visibility</h2>
                <p className="text-sm text-gray-500">Control whether students can reach you.</p>
              </div>
            </div>
            <Switch
              checked={form.is_accepting_students}
              onChange={(checked) => setField("is_accepting_students", checked)}
              label="Accepting students"
              description="Show that you are open for mentoring requests."
            />
          </AdminCard>

          <AdminCard className="p-6">
            <h2 className="font-heading text-lg font-semibold text-gray-900">Profile Checklist</h2>
            <div className="mt-4 space-y-3">
              {[
                "Choose one clear major specialty",
                "Add university and degree details",
                "Use a bio with practical student guidance",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </AdminCard>

          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {updateProfile.isPending ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
      )}
    </AdminPageShell>
  );
}
