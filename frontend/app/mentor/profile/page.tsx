"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Loader2, Save, ShieldCheck, UserRoundCog } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { AdminCard, AdminPageHeader, AdminPageShell } from "@/components/admin/AdminPage";
import Input from "@/components/ui/Input";
import SearchableDropdown, {
  type SearchableDropdownOption,
} from "@/components/ui/SearchableDropdown";
import Switch from "@/components/ui/Switch";
import Textarea from "@/components/ui/Textarea";
import type { PublicMajorItem } from "@/services/studentService";
import { loadPublicMajorOptions } from "@/services/dropdownOptions";
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

const toProfilePayload = (profile: {
  major_slug: string;
  is_accepting_students: boolean;
  bio: string;
  years_experience: number;
  degree: string;
  university_name: string;
  graduation_year: number;
  languages: string[];
  linkedin_url?: string | null;
  website_url?: string | null;
}): MentorProfilePayload => ({
  major_slug: profile.major_slug,
  is_accepting_students: profile.is_accepting_students,
  bio: profile.bio,
  years_experience: profile.years_experience,
  degree: profile.degree,
  university_name: profile.university_name,
  graduation_year: profile.graduation_year,
  languages: profile.languages,
  linkedin_url: profile.linkedin_url ?? "",
  website_url: profile.website_url ?? "",
});

export default function MentorProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState<MentorProfilePayload>(defaultForm);
  const [languageText, setLanguageText] = useState("English");
  const [majorOption, setMajorOption] =
    useState<SearchableDropdownOption<PublicMajorItem> | null>(null);
  const username = user?.username;

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
    if (!existingProfile) return;

    const nextProfile = toProfilePayload(existingProfile);

    setForm(nextProfile);
    setLanguageText(existingProfile.languages.join(", "));
    if (existingProfile.major_slug) {
      setMajorOption({
        value: existingProfile.major_slug,
        label:
          existingProfile.major?.name_en ??
          existingProfile.major?.name_ar ??
          existingProfile.major_slug,
      });
    }
  }, [existingProfile]);

  const updateProfile = useMutation({
    mutationFn: (payload: MentorProfilePayload) => mentorService.updateProfile(payload),
    onSuccess: (savedProfile) => {
      const nextProfile = toProfilePayload(savedProfile);

      setForm(nextProfile);
      setLanguageText(savedProfile.languages.join(", "));
      toast.success("Mentor profile updated successfully.");
    },
    onError: (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
      const errors = error.response?.data?.errors;
      const firstValidationError = errors
        ? Object.values(errors).flat().find(Boolean)
        : undefined;

      toast.error(
        firstValidationError ??
          error.response?.data?.message ??
          "Profile could not be updated. Check the required fields.",
      );
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
      is_accepting_students: Boolean(form.is_accepting_students),
    });
  };

  const profileCannotLoad =
    Boolean(username) &&
    !profileLoading &&
    profileError;

  const canShowForm = Boolean(username) && profileLoaded && Boolean(existingProfile);

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
                The existing profile must load first from `GET /mentors/{username}` before edits are enabled.
                Please try again after confirming the mentor username and profile status.
              </p>
            </div>
          </div>
        </AdminCard>
      )}

      {profileLoading && (
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
        <div className="xl:col-span-2">
          <AdminCard className="border-emerald-100 bg-emerald-50 p-4">
            <div className="flex gap-3 text-sm text-emerald-800">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Loaded the current mentor profile for @{username}. Updates will keep the existing status and only change
                editable profile details.
              </p>
            </div>
          </AdminCard>
        </div>

        <AdminCard className="p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <SearchableDropdown<PublicMajorItem>
              label="Major expertise"
              placeholder="Select a major"
              searchPlaceholder="Search majors..."
              emptyMessage="No majors found."
              value={form.major_slug}
              selectedOption={majorOption}
              loadOptions={loadPublicMajorOptions}
              onChange={(value, option) => {
                setMajorOption(option ?? null);
                setField("major_slug", value);
              }}
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
              hint={`${form.bio.length}/5000 characters.`}
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
            {updateProfile.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {updateProfile.isPending ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
      )}
    </AdminPageShell>
  );
}
