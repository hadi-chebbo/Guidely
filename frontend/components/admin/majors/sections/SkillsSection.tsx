"use client";

import { useCallback, useMemo, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { ADMIN_SKILLS, resolveAdminSkillLabel } from "@/lib/adminSkills";
import { getAvailableSkills } from "@/services/majorsService";
import type { MajorFormData } from "@/lib/validations/major";
import SearchableDropdown, {
  type SearchableDropdownOption,
} from "@/components/ui/SearchableDropdown";

interface SkillsSectionProps {
  lockedSkillIds?: number[];
}

export default function SkillsSection({ lockedSkillIds = [] }: SkillsSectionProps) {
  const { control, formState: { errors } } = useFormContext<MajorFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "skills" });
  const [skillLabels, setSkillLabels] = useState<Map<number, string>>(new Map());

  const selectedIds = useMemo(() => fields.map((f) => f.skill_id), [fields]);
  const selectedIdsKey = selectedIds.join(",");
  const loadSkillOptions = useCallback(
    async (search: string): Promise<SearchableDropdownOption<{ id: number; label: string }>[]> => {
      const availableSkills = await getAvailableSkills();
      const source = availableSkills?.length
        ? availableSkills.map((skill) => ({
            id: skill.id,
            label: skill.name,
          }))
        : ADMIN_SKILLS;
      const normalized = search.trim().toLowerCase();
      const options = source
        .filter(
          (skill) =>
            !selectedIds.includes(skill.id) &&
            (normalized ? skill.label.toLowerCase().includes(normalized) : true),
        )
        .slice(0, search ? 10 : 3);

      setSkillLabels((current) => {
        const next = new Map(current);
        source.forEach((skill) => next.set(skill.id, skill.label));
        return next;
      });

      return options.map((skill) => ({
        value: String(skill.id),
        label: skill.label,
        item: skill,
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIdsKey],
  );

  const addSkill = (id: number) => {
    append({ skill_id: id });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Skills</h3>
        <span className="text-xs text-gray-400">{fields.length} selected</span>
      </div>

      {/* Tag display */}
      <div className="flex flex-wrap gap-2 min-h-[40px] rounded-xl border border-gray-200 bg-gray-50 p-3">
        {fields.length === 0 && (
          <span className="text-sm text-gray-400 italic">No skills selected</span>
        )}
        {fields.map((field, index) => {
          const skillName = skillLabels.get(field.skill_id) ?? resolveAdminSkillLabel(field.skill_id);
          const isLocked = lockedSkillIds.includes(field.skill_id);
          return (
            <span
              key={field.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-950 px-3 py-1 text-xs font-medium text-white"
            >
              {skillName ?? `Skill #${field.skill_id}`}
              <button
                type="button"
                disabled={isLocked}
                onClick={() => remove(index)}
                title={isLocked ? "Existing skills can be kept or new skills can be added." : "Remove skill"}
                className="transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          );
        })}
      </div>

      {errors.skills && (
        <p className="text-xs text-red-500">{errors.skills.message}</p>
      )}

      <div className="relative">
        <SearchableDropdown<{ id: number; label: string }>
          value=""
          onChange={(value, option) => {
            if (!value) return;
            const id = Number(value);
            if (option?.label) {
              setSkillLabels((current) => new Map(current).set(id, option.label));
            }
            addSkill(id);
          }}
          loadOptions={loadSkillOptions}
          placeholder="Search or type to add skill..."
          searchPlaceholder="Search skills..."
          emptyMessage="All skills selected."
        />
      </div>
    </div>
  );
}
