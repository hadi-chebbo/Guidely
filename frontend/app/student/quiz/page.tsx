"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  getPublicMajors,
  keepCachedPublicMajorsForCurrentSession,
} from "@/services/studentService";
import { getQuizQuestions, submitQuiz } from "@/services/quizService";
import type { QuizQuestion } from "@/services/quizService";
import { cn } from "@/lib/utils";

export default function QuizPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuizQuestions();
        setQuestions(Array.isArray(data) ? data : []);
      } catch {
        setError("Failed to load questions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const hasAnsweredCurrent = answers[currentIndex] !== undefined;
  const answeredCount = Object.keys(answers).length;
  const progress = totalQuestions
    ? Math.round(((currentIndex + 1) / totalQuestions) * 100)
    : 0;
  const allAnswered =
    totalQuestions > 0 &&
    questions.every((_, index) => answers[index] !== undefined);

  const handleAnswer = (optionId: number) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;

    setIsSubmitting(true);
    try {
      const payload = questions.map((_, index) => answers[index]);
      await getPublicMajors({ per_page: 100, page: 1 });
      keepCachedPublicMajorsForCurrentSession();
      const result = await submitQuiz(payload);
      sessionStorage.setItem("quizResult", JSON.stringify(result));
      router.push("/student/quiz/results");
    } catch {
      setError("Failed to submit quiz. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-slate-100 px-4">
        <div className="rounded-3xl border border-white/80 bg-white/85 px-6 py-8 text-center shadow-card sm:px-10">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-600" />
          <p className="mt-3 text-sm font-medium text-gray-500">
            Loading questions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-slate-100 px-4">
        <div className="max-w-md rounded-3xl border border-white/80 bg-white/90 p-8 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <RefreshCw className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-heading text-xl font-bold text-gray-950">
            Quiz unavailable
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-slate-100 px-4">
        <div className="max-w-md rounded-3xl border border-white/80 bg-white/90 p-8 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-heading text-xl font-bold text-gray-950">
            No quiz questions yet
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            The quiz will be available once questions are added.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-card backdrop-blur">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.45fr_0.75fr] lg:p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
                <Sparkles className="h-3.5 w-3.5" />
                Guidance quiz
              </span>
              <h1 className="mt-4 max-w-2xl font-heading text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                Match your interests with majors that fit how you work.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                Answer each prompt and Guidely will prepare a focused starting
                point for your next comparison.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-950">
                    Question {currentIndex + 1} of {totalQuestions}
                  </p>
                  <p className="text-xs text-gray-500">
                    {answeredCount} answered
                  </p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span>Progress</span>
                  <span className="text-brand-700">{progress}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-brand-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Usually takes less than a minute</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/80 bg-white p-5 shadow-card sm:p-7">
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Prompt
              </p>
              <h2 className="mt-2 text-xl font-semibold leading-8 text-gray-950 sm:text-2xl">
                {currentQuestion.text_en ?? currentQuestion.text}
              </h2>
            </div>
            <div className="flex gap-1.5">
              {questions.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === currentIndex
                      ? "w-7 bg-brand-600"
                      : answers[index] !== undefined
                        ? "w-2 bg-brand-300"
                        : "w-2 bg-gray-200",
                  )}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentIndex] === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleAnswer(option.id)}
                  className={cn(
                    "group w-full rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-all",
                    isSelected
                      ? "border-brand-500 bg-brand-50 text-brand-900 shadow-sm ring-1 ring-brand-100"
                      : "border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-brand-50/40 hover:text-gray-950",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all",
                        isSelected
                          ? "border-brand-600 bg-brand-600"
                          : "border-gray-300 bg-white group-hover:border-brand-400",
                      )}
                    >
                      {isSelected && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      )}
                    </span>
                    <span className="leading-6">{option.text_en ?? option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                currentIndex === 0
                  ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
                  : "border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:text-brand-600",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {isLastQuestion ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all",
                  allAnswered && !isSubmitting
                    ? "bg-brand-600 shadow-brand hover:bg-brand-700"
                    : "cursor-not-allowed bg-gray-300",
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Quiz"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!hasAnsweredCurrent}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                  hasAnsweredCurrent
                    ? "bg-brand-600 text-white shadow-brand hover:bg-brand-700"
                    : "cursor-not-allowed bg-gray-200 text-gray-400",
                )}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
