import { majors } from "@/lib/majors";
import { notFound } from "next/navigation";

export default async function MajorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const major = majors.find((m) => m.slug === slug);

  if (!major) return notFound();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">
      
      {/* HERO */}
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-4">{major.name}</h1>

        <div className="flex gap-3 mb-4">
          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
            {major.category}
          </span>

          <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">
            {major.demand}
          </span>
        </div>

        <p className="text-gray-600 max-w-xl leading-relaxed">
          {major.description}
        </p>
      </div>

      {/* STICKY STATS */}
      <aside className="w-full lg:w-72 lg:sticky lg:top-20 h-fit border rounded-xl p-5 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Average Salary</p>
          <p className="font-semibold">{major.salary}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Job Openings</p>
          <p className="font-semibold">{major.jobs}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Study Duration</p>
          <p className="font-semibold">{major.duration}</p>
        </div>
      </aside>
    </div>
  );
}