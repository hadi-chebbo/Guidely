export type Major = {
  slug: string;
  name: string;
  category: string;
  demand: string;
  description: string;
  avgSalary: string;
  jobOpenings: string;
  duration: string;
};

export const majors: Major[] = [
  {
    slug: "computer-science",
    name: "Computer Science",
    category: "Engineering",
    demand: "High Demand",
    description:
      "Study algorithms, systems, and software design to build modern digital solutions.",
    avgSalary: "$95,000",
    jobOpenings: "1.2M+",
    duration: "4 Years",
  },
  {
    slug: "business-administration",
    name: "Business Administration",
    category: "Business",
    demand: "Medium Demand",
    description:
      "Learn management, finance, and strategy for leading organizations effectively.",
    avgSalary: "$70,000",
    jobOpenings: "800K+",
    duration: "3–4 Years",
  },
];