import { Pencil, Trash2 } from "lucide-react";
import { Table, THead, TBody, TR, TH, TD, TableEmpty } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import type { MajorListItem, DifficultyLevel } from "@/types/major";

const COL_COUNT = 7;

const difficultyVariant: Record<DifficultyLevel, "success" | "warning" | "danger"> = {
  easy: "success",
  medium: "warning",
  hard: "danger",
  very_hard: "danger",
};

const difficultyLabel: Record<DifficultyLevel, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  very_hard: "Very Hard",
};

interface MajorsTableProps {
  items: MajorListItem[];
  loading?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function MajorsTable({ items, loading = false, onEdit, onDelete }: MajorsTableProps) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Major</TH>
          <TH>Category</TH>
          <TH>Duration</TH>
          <TH>Difficulty</TH>
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
          <TableEmpty colSpan={COL_COUNT}>No majors found.</TableEmpty>
        ) : (
          items.map((item) => (
            <TR key={item.id}>
              <TD>
                <p className="font-medium text-gray-900">{item.name_en}</p>
                <p className="text-xs text-gray-400">{item.name_ar}</p>
              </TD>
              <TD className="text-gray-600">{item.category?.name_en ?? "—"}</TD>
              <TD className="text-gray-600">
                {item.duration_years} yr{item.duration_years !== 1 ? "s" : ""}
              </TD>
              <TD>
                <Badge variant={difficultyVariant[item.difficulty_level]}>
                  {difficultyLabel[item.difficulty_level]}
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
