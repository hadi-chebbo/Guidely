"use client";

import type { Major } from "@/types/major";

interface MajorReadOnlyDetailsProps {
  major: Major;
}

const formatSalary = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function MajorReadOnlyDetails({ major }: MajorReadOnlyDetailsProps) {
  return (
    <div className="grid gap-4 text-sm text-gray-700 sm:grid-cols-2">
      <div>
        <p className="text-xs font-medium uppercase text-gray-400">Category</p>
        <p className="mt-1 font-medium text-gray-900">{major.category?.name_en ?? "-"}</p>
      </div>
      <div>
        <p className="text-xs font-medium uppercase text-gray-400">Salary Range</p>
        <p className="mt-1 font-medium text-gray-900">
          {formatSalary(major.salary_min)} - {formatSalary(major.salary_max)}
        </p>
      </div>
      <div className="sm:col-span-2">
        <p className="text-xs font-medium uppercase text-gray-400">Overview</p>
        <p className="mt-1 leading-6">{major.overview || "-"}</p>
      </div>
      <div className="sm:col-span-2">
        <p className="text-xs font-medium uppercase text-gray-400">Skills</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(major.skills ?? []).length === 0 ? (
            <span className="text-gray-400">No skills assigned</span>
          ) : (
            major.skills?.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
              >
                {skill.name}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
