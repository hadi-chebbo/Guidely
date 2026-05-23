import type { SearchableDropdownOption } from "@/components/ui/SearchableDropdown";
import {
  getCategories,
  getPublicMajors,
  getPublicUniversities,
  type PublicMajorItem,
  type PublicUniversityItem,
  type StudentCategory,
} from "@/services/studentService";
import { getMajors } from "@/services/majorsService";
import type { MajorListItem } from "@/types/major";

const includesSearch = (values: Array<string | null | undefined>, search: string) => {
  const normalized = search.trim().toLowerCase();
  if (!normalized) return true;

  return values.some((value) => value?.toLowerCase().includes(normalized));
};

export async function loadAdminMajorOptions(
  search: string,
): Promise<SearchableDropdownOption<MajorListItem>[]> {
  const response = await getMajors({
    page: 1,
    per_page: search ? 10 : 3,
    name_en: search || undefined,
  });

  return response.data.map((major) => ({
    value: String(major.id),
    label: major.name_en,
    item: major,
  }));
}

export async function loadPublicMajorOptions(
  search: string,
): Promise<SearchableDropdownOption<PublicMajorItem>[]> {
  const hasSearch = Boolean(search.trim());
  const data = await getPublicMajors({
    per_page: hasSearch ? 10 : 3,
    page: 1,
    search: hasSearch ? search : undefined,
    name_en: hasSearch ? search : undefined,
  });

  return [
    ...data.recommended,
    ...data.featured,
    ...data.others.data,
  ]
    .filter(
      (major, index, all) =>
        all.findIndex((item) => item.slug === major.slug) === index,
    )
    .filter((major) =>
      includesSearch(
        [major.name_en, major.name_ar, major.slug, major.category?.name_en],
        search,
      ),
    )
    .sort((a, b) => a.name_en.localeCompare(b.name_en))
    .slice(0, hasSearch ? 10 : 3)
    .map((major) => ({
      value: major.slug,
      label: major.name_en,
      item: major,
    }));
}

export async function loadPublicUniversityOptions(
  search: string,
): Promise<SearchableDropdownOption<PublicUniversityItem>[]> {
  const hasSearch = Boolean(search.trim());
  const data = await getPublicUniversities({
    per_page: hasSearch ? 10 : 3,
    page: 1,
    search: hasSearch ? search : undefined,
  });

  return data.data
    .sort((a, b) => a.name_en.localeCompare(b.name_en))
    .slice(0, hasSearch ? 10 : 3)
    .map((university) => ({
      value: university.slug,
      label: university.name_en,
      item: university,
    }));
}

export async function loadCategoryOptions(
  search: string,
): Promise<SearchableDropdownOption<StudentCategory>[]> {
  const categories = await getCategories();

  return categories
    .filter((category) =>
      includesSearch([category.name_en, category.name_ar, category.slug], search),
    )
    .slice(0, search ? 10 : 3)
    .map((category) => ({
      value: String(category.id),
      label: category.name_en,
      item: category,
    }));
}
