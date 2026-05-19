import { redirect } from "next/navigation";

type ResetPasswordAliasPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const buildResetPasswordUrl = (
  searchParams: ResetPasswordAliasPageProps["searchParams"]
) => {
  const query = new URLSearchParams();

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
      return;
    }

    if (value) {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `/reset-password?${queryString}` : "/reset-password";
};

export default function ResetPasswordAliasPage({
  searchParams,
}: ResetPasswordAliasPageProps) {
  redirect(buildResetPasswordUrl(searchParams));
}
