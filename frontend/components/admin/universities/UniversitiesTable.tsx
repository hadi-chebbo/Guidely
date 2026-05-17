"use client";

import { ExternalLink, Eye, Pencil } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
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
    <Table>
      <THead className="bg-gray-50 text-gray-600">
        <TR>
          <TH>University</TH>
          <TH>Location</TH>
          <TH>Type</TH>
          <TH>Description</TH>
          <TH>Website</TH>
          <TH>Founded</TH>
          <TH>Accreditation</TH>
          <TH className="text-right">Actions</TH>
        </TR>
      </THead>
      <TBody>
        {data.map((u) => (
          <TR key={u.id} className="hover:bg-brand-50/40">
            <TD>
              <div className="flex min-w-64 items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
                  {u.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={u.logo_url}
                      alt={u.name_en}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-50 text-xs font-semibold text-brand-700">
                      {u.name_en?.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{u.name_en}</p>
                  {u.name_ar && <p className="text-xs text-gray-400">{u.name_ar}</p>}
                </div>
              </div>
            </TD>
            <TD className="text-gray-600">{u.location || "-"}</TD>
            <TD>
              <Badge variant={u.type === "public" ? "success" : "info"}>{u.type}</Badge>
            </TD>
            <TD className="max-w-xs text-gray-600">
              <p className="line-clamp-2">{u.description_en ?? "-"}</p>
            </TD>
            <TD>
              {u.website ? (
                <a
                  href={u.website.startsWith("http") ? u.website : `https://${u.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-900"
                >
                  Visit
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </TD>
            <TD className="text-gray-600">{u.founded_year ?? "-"}</TD>
            <TD className="max-w-[12rem] truncate text-gray-600">{u.accreditation ?? "-"}</TD>
            <TD>
              <div className="flex justify-end gap-1">
                <button
                  onClick={() => onView(u.id)}
                  className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-brand-50 hover:text-brand-700"
                  aria-label={`View ${u.name_en}`}
                  title={`View ${u.name_en}`}
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit(u)}
                  className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  aria-label={`Edit ${u.name_en}`}
                  title={`Edit ${u.name_en}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
