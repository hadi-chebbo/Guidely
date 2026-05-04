import { Building2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HiringCompany {
  id: number;
  major_id: number;
  company_name: string;
  industry: string | null;
  location: string;
  logo_url: string | null;
  website_url: string | null;
  is_local: boolean;
}

export default function CompaniesSection({ companies }: { companies: HiringCompany[] }) {
  if (!companies || companies.length === 0) return null;

  return (
    <section>
      {/* Heading */}
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-brand-600" />
        <h2 className="text-xl font-bold text-gray-900 font-heading">Hiring Companies</h2>
      </div>
      <p className="text-sm text-gray-500 mt-1">
        Companies actively hiring graduates in this field
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {companies.map((company) => {
          const card = (
            <div
              className={cn(
                "bg-white rounded-xl border border-gray-100 shadow-sm p-4",
                "flex flex-col items-center text-center",
                "hover:border-brand-200 hover:shadow-card transition-all"
              )}
            >
              {/* Logo or fallback icon */}
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.company_name}
                  className="h-12 w-12 object-contain mb-3 rounded-lg"
                />
              ) : (
                <div className="bg-brand-50 rounded-lg h-12 w-12 flex items-center justify-center mb-3">
                  <Building2 className="h-6 w-6 text-brand-400" />
                </div>
              )}

              {/* Company name */}
              <span className="text-sm font-semibold text-gray-900 line-clamp-1 w-full">
                {company.company_name}
              </span>

              {/* Industry */}
              {company.industry && (
                <span className="text-xs text-gray-400 mt-0.5 line-clamp-1 w-full">
                  {company.industry}
                </span>
              )}

              {/* Location */}
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mt-1">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="line-clamp-1">{company.location}</span>
              </div>

              {/* Local / International badge */}
              <span
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full mt-2",
                  company.is_local
                    ? "bg-blue-50 text-blue-600"
                    : "bg-purple-50 text-purple-600"
                )}
              >
                {company.is_local ? "Local" : "International"}
              </span>
            </div>
          );

          return company.website_url ? (
            <a
              key={company.id}
              href={company.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {card}
            </a>
          ) : (
            <div key={company.id}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}
