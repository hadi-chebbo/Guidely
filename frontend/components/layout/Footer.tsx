import Link from "next/link";
import { GraduationCap } from "lucide-react";

const footerLinks = {
  Platform: [
    { href: "/majors",        label: "Explore Majors" },
    { href: "/compare",       label: "Compare Majors" },
    { href: "/universities",  label: "Universities" },
    { href: "/quiz",          label: "Personality Test" },
    { href: "/mentors",       label: "Find a Mentor" },
  ],
  Resources: [
    { href: "/market",        label: "Market Research" },
    { href: "/blog",          label: "Blog" },
    { href: "/faq",           label: "FAQ" },
  ],
  Company: [
    { href: "/about",         label: "About" },
    { href: "/contact",       label: "Contact" },
    { href: "/privacy",       label: "Privacy Policy" },
    { href: "/terms",         label: "Terms of Service" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-heading font-bold text-brand-700">
              <GraduationCap className="h-5 w-5" />
              <span className="text-lg">Guidely</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Helping Lebanese students choose the right university major — backed by real data and
              local market insights.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {group}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-gray-600 hover:text-brand-700 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Guidely. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">Made for Lebanese students, with care.</p>
        </div>
      </div>
    </footer>
  );
}
