"use client";

import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { X, Plus } from "lucide-react";
import { ADMIN_SKILLS, resolveAdminSkillLabel } from "@/lib/adminSkills";
import { getAvailableSkills } from "@/services/majorsService";
import type { MajorFormData } from "@/lib/validations/major";

interface SkillsSectionProps {
  lockedSkillIds?: number[];
}

export default function SkillsSection({ lockedSkillIds = [] }: SkillsSectionProps) {
  const { control, formState: { errors } } = useFormContext<MajorFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "skills" });
  const { data: availableSkills } = useQuery({
    queryKey: ["admin-major-skill-options"],
    queryFn: getAvailableSkills,
  });

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedIds = fields.map((f) => f.skill_id);
  const skillOptions = availableSkills?.length
    ? availableSkills.map((skill) => ({
        id: skill.id,
        label: skill.name,
        type: skill.type,
      }))
    : ADMIN_SKILLS;
  const skillLabels = new Map(skillOptions.map((skill) => [skill.id, skill.label]));

  const filtered = skillOptions.filter(
    (s) =>
      !selectedIds.includes(s.id) &&
      s.label.toLowerCase().includes(search.toLowerCase())
  );

  const addSkill = (id: number) => {
    append({ skill_id: id });
    setSearch("");
    setShowDropdown(false);
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
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search or type to add skill..."
            className="auth-input flex-1"
          />
          <button
            type="button"
            onClick={() => setShowDropdown((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {showDropdown && (
          <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400 italic">
                {search ? `No match for "${search}"` : "All skills selected"}
              </p>
            ) : (
              <ul className="max-h-48 overflow-y-auto py-1">
                {filtered.map((skill) => (
                  <li key={skill.id}>
                    <button
                      type="button"
                      onClick={() => addSkill(skill.id)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {skill.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {showDropdown && (
        <div
          className="fixed inset-0 z-[9]"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
