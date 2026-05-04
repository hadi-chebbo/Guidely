import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Mock data for development / design preview (do NOT use in production logic):
 *
 * pros: [
 *   "Strong job market",
 *   "High salary ceiling",
 *   "Remote work options",
 *   "Diverse career paths",
 * ]
 *
 * cons: [
 *   "Long learning curve",
 *   "Requires continuous upskilling",
 *   "High competition in some markets",
 * ]
 */

export interface MajorPoint {
  id: number;
  major_id: number;
  type: "pro" | "con";
  content: string;
}

export default function ProsConsSection({ points }: { points: MajorPoint[] }) {
  const pros = points.filter((p) => p.type === "pro");
  const cons = points.filter((p) => p.type === "con");

  if (pros.length === 0 && cons.length === 0) {
    return null;
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6")}>
      {/* Pros column */}
      <div
        className={cn(
          "bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className={cn(
              "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
              "bg-emerald-50 text-emerald-600"
            )}
          >
            <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <h3 className="text-lg font-semibold text-gray-900">Advantages</h3>
        </div>

        {/* List */}
        {pros.length > 0 ? (
          <ul className="space-y-2.5">
            {pros.map((pro) => (
              <li key={pro.id} className="flex items-start gap-2.5">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500"
                  strokeWidth={1.75}
                />
                <span className="text-sm text-gray-700">{pro.content}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 italic">
            No advantages listed yet.
          </p>
        )}
      </div>

      {/* Cons column */}
      <div
        className={cn(
          "bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className={cn(
              "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
              "bg-red-50 text-red-500"
            )}
          >
            <XCircle className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <h3 className="text-lg font-semibold text-gray-900">Challenges</h3>
        </div>

        {/* List */}
        {cons.length > 0 ? (
          <ul className="space-y-2.5">
            {cons.map((con) => (
              <li key={con.id} className="flex items-start gap-2.5">
                <XCircle
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400"
                  strokeWidth={1.75}
                />
                <span className="text-sm text-gray-700">{con.content}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 italic">
            No challenges listed yet.
          </p>
        )}
      </div>
    </div>
  );
}
