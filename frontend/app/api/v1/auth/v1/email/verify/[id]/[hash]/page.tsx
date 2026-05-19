import { redirect } from "next/navigation";

type PageProps = {
  params: {
    id: string;
    hash: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
};

const firstParam = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value[0] ?? "" : value ?? "";

export default function EmailVerificationRedirect({
  params,
  searchParams,
}: PageProps) {
  const query = new URLSearchParams({
    id: params.id,
    hash: params.hash,
    expires: firstParam(searchParams.expires),
    signature: firstParam(searchParams.signature),
  });

  redirect(`/verify-email?${query.toString()}`);
}
