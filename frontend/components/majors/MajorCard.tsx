import Link from "next/link";
import type { Major } from "@/types/major";

type Props = {
  major: Major;
};

const demandColor = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-green-100 text-green-700",
  very_high: "bg-blue-100 text-blue-700",
};

export default function MajorCard({ major }: Props) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <div className="flex gap-2 mb-2">
        {major.category && (
          <span className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded-full">
            {major.category.name_en}
          </span>
        )}
        <span
          className={`text-xs px-2 py-1 rounded-full ${demandColor[major.local_demand]}`}
        >
          {major.local_demand.replace("_", " ")} Demand
        </span>
      </div>
      <h3 className="font-bold text-lg">{major.name_en}</h3>
      <p className="text-gray-500 text-sm mt-1">{major.overview}</p>
      <Link
        href={`/majors/${major.slug}`}
        className="text-brand-700 text-sm mt-3 inline-block hover:underline"
      >
        View details →
      </Link>
    </div>
  );
}
