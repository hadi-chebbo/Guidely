const STORAGE_KEY = "guidely.admin.majorUpdateDates";

export type MajorUpdateDateMap = Record<number, string>;

export const readMajorUpdateDates = (): MajorUpdateDateMap => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");

    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => typeof value === "string")
    ) as MajorUpdateDateMap;
  } catch {
    return {};
  }
};

export const saveMajorUpdateDate = (
  majorId: number,
  updatedAt = new Date().toISOString()
) => {
  const next = {
    ...readMajorUpdateDates(),
    [majorId]: updatedAt,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return next;
};

export const mergeMajorUpdateDates = <T extends { id: number; updated_at: string }>(
  items: T[],
  updateDates: MajorUpdateDateMap
) =>
  items.map((item) => ({
    ...item,
    updated_at: item.updated_at || updateDates[item.id] || "",
  }));
