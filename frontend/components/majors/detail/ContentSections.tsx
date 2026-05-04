"use client";

import { useState } from "react";
import { Zap, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type SkillType = "hard" | "soft";

export interface Skill {
  id: number;
  name: string;
  type: SkillType;
  icon: string | null;
}

export interface FAQ {
  id: number;
  major_id: number;
  question: string;
  answer: string;
  sort_order: number;
}

// ---------------------------------------------------------------------------
// SkillsSection
// ---------------------------------------------------------------------------

export function SkillsSection({ skills }: { skills: Skill[] }) {
  if (!skills || skills.length === 0) return null;

  const hardSkills = skills.filter((s) => s.type === "hard");
  const softSkills = skills.filter((s) => s.type === "soft");

  return (
    <section className="space-y-4">
      {/* Heading */}
      <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 font-heading">
        <Zap className="h-5 w-5 text-brand-600" />
        Skills
      </h2>

      <div className="space-y-5">
        {/* Hard skills */}
        {hardSkills.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Technical Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {hardSkills.map((skill) => (
                <span
                  key={skill.id}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                    "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                  )}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Soft skills */}
        {softSkills.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Soft Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((skill) => (
                <span
                  key={skill.id}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                    "bg-gray-50 text-gray-700 ring-1 ring-gray-200"
                  )}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FAQSection
// ---------------------------------------------------------------------------

export function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const sorted = [...faqs].sort((a, b) => a.sort_order - b.sort_order);

  function toggle(id: number) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <section className="space-y-4">
      {/* Heading */}
      <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 font-heading">
        <HelpCircle className="h-5 w-5 text-brand-600" />
        Frequently Asked Questions
      </h2>

      <div>
        {sorted.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className="border-b border-gray-100 py-4 last:border-0"
            >
              {/* Question row */}
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                className="text-sm font-semibold text-gray-900 flex items-center justify-between cursor-pointer w-full text-left"
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-gray-400 ml-3" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 ml-3" />
                )}
              </button>

              {/* Answer */}
              {isOpen && (
                <p className="text-sm text-gray-600 leading-relaxed mt-2 pb-2">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
