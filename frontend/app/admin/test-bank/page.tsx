import { ClipboardList, Clock3 } from "lucide-react";
import { AdminCard, AdminPageHeader, AdminPageShell } from "@/components/admin/AdminPage";

export default function AdminTestBankPage() {
  return (
    <AdminPageShell>
      <AdminPageHeader
        eyebrow="Planning"
        title="Test Bank"
        description="Quiz question management will be available here soon."
      />

      <AdminCard className="p-8">
        <div className="flex max-w-2xl flex-col gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <ClipboardList className="h-7 w-7" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">Available soon</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              The test bank workspace is being prepared for creating, reviewing, and organizing quiz questions.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-600">
            <Clock3 className="h-4 w-4" />
            Coming soon
          </div>
        </div>
      </AdminCard>
    </AdminPageShell>
  );
}
