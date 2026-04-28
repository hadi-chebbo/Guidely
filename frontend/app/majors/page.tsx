"use client";

import { useState } from "react";
import MajorCard from "@/components/MajorCard";

const mockMajors = [
  {
    id: 1,
    name: "Computer Science",
    category: "Technology",
    demandLevel: "High",
    description: "Study algorithms, programming, and software development.",
  },
  {
    id: 2,
    name: "Business Administration",
    category: "Business",
    demandLevel: "High",
    description: "Learn management, finance, and entrepreneurship.",
  },
  {
    id: 3,
    name: "Architecture",
    category: "Design",
    demandLevel: "Medium",
    description: "Design and plan buildings and urban spaces.",
  },
  {
    id: 4,
    name: "Medicine",
    category: "Health",
    demandLevel: "High",
    description: "Study human health, diseases, and medical treatment.",
  },
  {
    id: 5,
    name: "Graphic Design",
    category: "Design",
    demandLevel: "Medium",
    description: "Create visual content for print and digital media.",
  },
];

export default function MajorsPage() {
  const [isGrid, setIsGrid] = useState(true);

  return (
    <div className="min-h-screen p-6">
      {/* Toggle Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsGrid(!isGrid)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
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
            <MajorCard
              key={major.id}
              id={major.id}
              name={major.name}
              category={major.category}
              demandLevel={major.demandLevel}
              description={major.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
