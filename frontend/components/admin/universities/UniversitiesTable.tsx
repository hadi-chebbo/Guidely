import { Pencil, Trash2 } from "lucide-react";
import { Table, THead, TBody, TR, TH, TD, TableEmpty } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import type { UniversityListItem, AccreditationStatus } from "@/types/university";

const COL_COUNT = 8;

const accreditationVariant: Record<AccreditationStatus, "success" | "warning" | "danger"> = {
  accredited: "success",
  pending: "warning",
  not_accredited: "danger",
};

const accreditationLabel: Record<AccreditationStatus, string> = {
  accredited: "Accredited",
  pending: "Pending",
  not_accredited: "Not Accredited",
};

interface UniversitiesTableProps {
  items: UniversityListItem[];
  loading?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function UniversitiesTable({
  items,
  loading = false,
  onEdit,
  onDelete,
}: UniversitiesTableProps) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>University</TH>
          <TH>Location</TH>
          <TH>Type</TH>
          <TH>Accreditation</TH>
          <TH>Featured</TH>
          <TH>Updated</TH>
          <TH className="text-right">Actions</TH>
        </TR>
      </THead>
      <TBody>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TR key={i}>
              {Array.from({ length: COL_COUNT }).map((_, j) => (
                <TD key={j}>
                  <Skeleton className="h-4 w-full" />
                </TD>
              ))}
            </TR>
          ))
        ) : items.length === 0 ? (
          <TableEmpty colSpan={COL_COUNT}>No universities found.</TableEmpty>
        ) : (
          items.map((item) => (
            <TR key={item.id}>
              <TD>
                <div className="flex items-center gap-2.5">
                  {item.logo_url && (
                    <img
                      src={item.logo_url}
                      alt={`${item.name_en} logo`}
                      width={32}
                      height={32}
                      className="h-8 w-8 shrink-0 rounded object-contain"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{item.name_en}</p>
                    <p className="text-xs text-gray-400">{item.name_ar}</p>
                  </div>
                </div>
              </TD>
              <TD className="text-gray-600">{`${item.location}, ${item.country}`}</TD>
              <TD>
                <Badge variant={item.type === "public" ? "brand" : "default"}>
                  {item.type === "public" ? "Public" : "Private"}
                </Badge>
              </TD>
              <TD>
                <Badge variant={accreditationVariant[item.accreditation_status]}>
                  {accreditationLabel[item.accreditation_status]}
                </Badge>
              </TD>
              <TD>
                <Badge variant={item.is_featured ? "brand" : "default"}>
                  {item.is_featured ? "Featured" : "No"}
                </Badge>
              </TD>
              <TD className="text-gray-500">
                {new Date(item.updated_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </TD>
              <TD>
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(item.id)}
                    className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-brand-950"
                    aria-label={`Edit ${item.name_en}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${item.name_en}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </Table>
  );
}
