import { BookOpen, Building2, Users, ClipboardList } from "lucide-react";

const stats = [
  { label: "Majors",       value: "—", icon: BookOpen },
  { label: "Universities", value: "—", icon: Building2 },
  { label: "Users",        value: "—", icon: Users },
  { label: "Test Questions", value: "—", icon: ClipboardList },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Overview</h1>
        <p className="mt-1 text-sm text-gray-500">Platform stats and recent activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">{label}</span>
              <Icon className="h-4 w-4 text-brand-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
