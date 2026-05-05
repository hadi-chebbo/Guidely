"use client";

import type { University } from "@/types/university";

export default function UniversitiesTable({
  data,
  onEdit,
  onView,
}: {
  data: University[];
  onEdit: (u: University) => void;
  onView: (id: number) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white/60 backdrop-blur-xl">

      <table className="w-full min-w-[1000px] text-sm">

        {/* HEADER */}
        <thead className="bg-brand-50/70 backdrop-blur sticky top-0 z-10">
          <tr className="text-left text-gray-700">
            <th className="p-4 font-semibold">Logo</th>
            <th className="p-4 font-semibold">Name</th>
            <th className="p-4 font-semibold">Location</th>
            <th className="p-4 font-semibold">Type</th>
            <th className="p-4 font-semibold">Description</th>
            <th className="p-4 font-semibold">Website</th>
            <th className="p-4 font-semibold">Founded</th>
            <th className="p-4 font-semibold">Accreditation</th>
            <th className="p-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-brand-100 bg-white/70">

          {data.length === 0 ? (
            <tr>
              <td colSpan={9} className="p-14 text-center text-gray-400">
                No universities found
              </td>
            </tr>
          ) : (
            data.map((u) => (
              <tr
                key={u.id}
                className="group hover:bg-brand-50/60 transition"
              >

                {/* LOGO */}
                <td className="p-4">
                  <div className="w-11 h-11 rounded-xl overflow-hidden border border-brand-100 bg-white">

                    {u.logo_url ? (
                      <img
                        src={u.logo_url}
                        alt={u.name_en}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-logo.png";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-brand-600 bg-brand-100">
                        {u.name_en?.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                  </div>
                </td>

                {/* NAME */}
                <td className="p-4">
                  <p className="font-medium text-gray-900 group-hover:text-brand-700">
                    {u.name_en}
                  </p>
                  {u.name_ar && (
                    <p className="text-xs text-gray-400">{u.name_ar}</p>
                  )}
                </td>

                {/* LOCATION */}
                <td className="p-4 text-gray-600">{u.location}</td>

                {/* TYPE */}
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.type === "public"
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {u.type}
                  </span>
                </td>

                {/* DESCRIPTION */}
                <td className="p-4">
                  <p className="text-gray-600 line-clamp-2">
                    {u.description_en ?? "-"}
                  </p>

                  {u.description_ar && (
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                      {u.description_ar}
                    </p>
                  )}
                </td>

                {/* WEBSITE */}
                <td className="p-4">
                  {u.website ? (
                    <a
                      href={u.website.startsWith("http") ? u.website : `https://${u.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline"
                    >
                      Visit
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>

                {/* FOUNDED */}
                <td className="p-4 text-gray-600">
                  {u.founded_year ?? "-"}
                </td>

                {/* ACCREDITATION */}
                <td className="p-4 text-gray-600">
                  {u.accreditation ?? "-"}
                </td>

                {/* ACTIONS */}
                <td className="p-4">
                  <div className="flex justify-end gap-2">

                    <button
                      onClick={() => onView(u.id)}
                      className="px-3 py-1.5 rounded-lg text-brand-700 hover:bg-brand-100"
                    >
                      View
                    </button>

                    <button
                      onClick={() => onEdit(u)}
                      className="px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow-brand"
                    >
                      Edit
                    </button>

                  </div>
                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>
    </div>
  );
}