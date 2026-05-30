"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Radar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip
);

const matchData = {
  labels: ["CS", "Business", "Design"],
  datasets: [
    {
      label: "Match score",
      data: [92, 86, 78],
      backgroundColor: ["#5D5FEF", "#14B8A6", "#F59E0B"],
      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 42,
    },
  ],
};

const profileData = {
  labels: ["Major fit", "Career fit", "Mentor ready"],
  datasets: [
    {
      data: [92, 88, 74],
      backgroundColor: ["#5D5FEF", "#14B8A6", "#F59E0B"],
      borderColor: "#ffffff",
      borderWidth: 4,
      hoverOffset: 6,
    },
  ],
};

const readinessData = {
  labels: ["Interests", "Skills", "Market", "Universities", "Mentors"],
  datasets: [
    {
      label: "Student readiness",
      data: [86, 78, 82, 90, 74],
      backgroundColor: "rgba(93, 95, 239, 0.16)",
      borderColor: "#5D5FEF",
      borderWidth: 2,
      pointBackgroundColor: "#14B8A6",
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
      pointRadius: 4,
    },
  ],
};

const baseFont = {
  family: "Inter, sans-serif",
  size: 11,
};

export default function LandingStatsChart() {
  return (
    <div className="grid gap-5 p-5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1.15fr)_minmax(150px,0.85fr)]">
        <div className="min-h-[210px] rounded-xl border border-gray-100 bg-slate-50/80 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-gray-950">Top major matches</p>
            <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-brand-700 shadow-sm">
              Live profile
            </span>
          </div>
          <div className="h-40">
            <Bar
              data={matchData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (item) => `${item.raw}% match`,
                    },
                  },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { color: "#64748b", font: baseFont },
                  },
                  y: {
                    beginAtZero: true,
                    max: 100,
                    border: { display: false },
                    grid: { color: "rgba(148, 163, 184, 0.22)" },
                    ticks: {
                      color: "#94a3b8",
                      font: baseFont,
                      callback: (value) => `${value}%`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="min-h-[210px] rounded-xl border border-gray-100 bg-white p-4">
          <p className="mb-3 text-sm font-bold text-gray-950">Decision mix</p>
          <div className="mx-auto h-40 max-w-[190px]">
            <Doughnut
              data={profileData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "66%",
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      boxHeight: 8,
                      boxWidth: 8,
                      color: "#64748b",
                      font: baseFont,
                      padding: 12,
                      usePointStyle: true,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="min-h-[230px] rounded-xl border border-gray-100 bg-white p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-gray-950">Guidance readiness</p>
          <p className="text-xs font-semibold text-gray-500">Score out of 100</p>
        </div>
        <div className="h-48">
          <Radar
            data={readinessData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
              scales: {
                r: {
                  beginAtZero: true,
                  max: 100,
                  grid: { color: "rgba(148, 163, 184, 0.26)" },
                  angleLines: { color: "rgba(148, 163, 184, 0.22)" },
                  pointLabels: {
                    color: "#475569",
                    font: { family: "Inter, sans-serif", size: 11, weight: 600 },
                  },
                  ticks: {
                    display: false,
                    stepSize: 25,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
