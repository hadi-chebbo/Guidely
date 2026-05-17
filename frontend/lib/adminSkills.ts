export const ADMIN_SKILLS: { id: number; label: string; type: "hard" | "soft" }[] = [
  { id: 1, label: "Critical Thinking", type: "soft" },
  { id: 2, label: "Problem Solving", type: "soft" },
  { id: 3, label: "Communication", type: "soft" },
  { id: 4, label: "Programming", type: "hard" },
  { id: 5, label: "Data Analysis", type: "hard" },
  { id: 6, label: "Networking", type: "hard" },
];

const normalizeSkillName = (name: string) => name.trim().toLowerCase();

export const resolveAdminSkillId = (name?: string | null) => {
  if (!name) return undefined;

  return ADMIN_SKILLS.find((skill) => normalizeSkillName(skill.label) === normalizeSkillName(name))?.id;
};

export const resolveAdminSkillLabel = (id?: number | null) =>
  ADMIN_SKILLS.find((skill) => skill.id === id)?.label;

export const resolveAdminSkillType = (name?: string | null) =>
  ADMIN_SKILLS.find((skill) => normalizeSkillName(skill.label) === normalizeSkillName(name ?? ""))?.type ?? "hard";

export const resolveAdminSkillLabels = (ids: number[]) =>
  ids.map((id) => resolveAdminSkillLabel(id)).filter((label): label is string => Boolean(label));
