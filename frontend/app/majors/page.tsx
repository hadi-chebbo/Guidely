"use client";

import { useState } from "react";
import MajorCard from "@/components/majors/MajorCard";
import { mockMajors } from "@/lib/mocks/majors";

export default function MajorsPage() {
  const [isGrid, setIsGrid] = useState(true);

  return (
    <div className="min-h-screen p-6">
      {/* Toggle Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsGrid(!isGrid)}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg"
        >
          {isGrid ? "Switch to List View" : "Switch to Grid View"}
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar - Filters */}
        <div className="w-full md:w-64 bg-gray-100 rounded-xl p-4">
          <h2 className="font-bold text-lg mb-4">Filters</h2>
          <p className="text-gray-500 text-sm">Filter options coming soon...</p>
        </div>

        {/* Right - Major Cards */}
        <div
          className={`flex-1 ${isGrid ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}`}
        >
          {mockMajors.map((major) => (
            <MajorCard key={major.id} major={major} />
          ))}
        </div>
      </div>
    </div>
  );
}
