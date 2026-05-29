import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Platform: [
    { href: "/student/dashboard", label: "Dashboard" },
    { href: "/student/majors", label: "Majors" },
    { href: "/student/compare", label: "Compare" },
    { href: "/student/universities", label: "Universities" },
    { href: "/student/mentors", label: "Mentors" },
  ],
  Resources: [
    { href: "/student/quiz", label: "Quiz" },
    { href: "/student/sessions", label: "Sessions" },
    { href: "/student/favorites", label: "Favorites" },
  ],
  Account: [
    { href: "/student/reservations", label: "Reservations" },
    { href: "/mentor", label: "Mentor Area" },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1.75fr)] lg:items-start">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-transparent.png"
                alt="Guidely"
                width={44}
                height={44}
                className="object-contain"
              />

              <span className="font-heading text-2xl font-bold text-brand-700">
                Guidely
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              Guidely helps students make informed academic decisions through
              university insights, major comparisons, mentor guidance, and market-aware
              career context.
            </p>

            <p className="mt-4 text-xs font-medium text-gray-500">
              Built for students planning their next academic step.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-8 text-sm sm:grid-cols-3 lg:justify-items-end lg:gap-x-14">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group} className="w-full max-w-[10rem]">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {group}
                </h3>

                <ul className="space-y-2">
                  {links.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="font-medium text-gray-600 transition-colors hover:text-brand-700"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200" />

        <div className="flex flex-col gap-3 pt-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Guidely. All rights reserved.
          </p>

          <p className="text-xs font-medium text-gray-500 sm:text-right">
            Academic guidance, mentor support, and career clarity.
          </p>
        </div>
      </div>
    </footer>
  );
}
