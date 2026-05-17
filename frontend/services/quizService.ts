import api from "@/lib/api";

/* ── Types ── */
export interface QuizOption {
  id: number;
  text_en: string;
  text_ar?: string;
  text?: string;
}

export interface QuizQuestion {
  id?: number;
  text_en: string;
  text_ar?: string;
  text?: string;
  options: QuizOption[];
}

export type QuizAnswer = number;

export interface QuizRecommendation {
  id?: number;
  major_id?: number;
  slug?: string;
  major_name?: string;
  en_major_name?: string;
  ar_major_name?: string;
  name_en?: string;
  name_ar?: string;
  match_percentage?: number;
  overview?: string;
}

export interface QuizResult {
  score?: number;
  recommended_majors?: QuizRecommendation[];
  recommendations?: QuizRecommendation[];
  message?: string;
}

export interface LegacyQuizResult {
  score?: number;
  recommended_majors?: Array<{
    id: number;
    name_en: string;
    slug: string;
    overview: string;
  }>;
  message?: string;
}

/* ── API calls ── */

// GET /test/questions
export const getQuizQuestions = async (): Promise<QuizQuestion[]> => {
  const res = await api.get("/test/questions");
  return res.data.data ?? res.data;
};

// POST /test/submit
export const submitQuiz = async (
  answers: number[],
): Promise<QuizResult> => {
  const res = await api.post("/test/submit", { answers });
  return res.data.data ?? res.data;
};
