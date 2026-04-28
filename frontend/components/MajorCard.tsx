import Link from "next/link";

type Props = {
  id: number;
  name: string;
  category: string;
  demandLevel: string;
  description: string;
};

export default function MajorCard({
  id,
  name,
  category,
  demandLevel,
  description,
}: Props) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <div className="flex gap-2 mb-2">
        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
          {category}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            demandLevel === "High"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {demandLevel} Demand
        </span>
      </div>
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
      <Link
        href={`/majors/${id}`}
        className="text-indigo-600 text-sm mt-3 inline-block hover:underline"
      >
        View details →
      </Link>
    </div>
  );
}
