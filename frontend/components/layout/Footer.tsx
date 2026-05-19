import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Platform: [
    { href: "/student/majors", label: "Majors" },
    { href: "/compare", label: "Compare" },
    { href: "/universities", label: "Universities" },
    { href: "/student/quiz", label: "Quiz" },
    { href: "/mentors", label: "Mentors" },
  ],
  Resources: [
    { href: "/market", label: "Market" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white w-full">
      <div className="max-w-7xl mx-auto px-6 py-5">
        
        {/* TOP */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          
          {/* BRAND */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-transparent.png"
                alt="Guidely"
                width={44}
                height={44}
                className="object-contain"
              />

            <span className="text-xl font-heading font-bold text-brand-700">
    Guidely
  </span>
            </div>

            {/* NECESSITY TEXT */}
            <p className="mt-2 text-[11px] text-gray-500 leading-relaxed">
              Guidely helps students make informed academic decisions by analyzing real
              university data, career demand, and market trends — all in one place.
            </p>
          </div>

          {/* LINKS */}
          <div className="grid grid-cols-3 gap-x-12 gap-y-4 text-sm">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  {group}
                </h3>

                <ul className="space-y-1.5">
                  {links.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-gray-600 hover:text-brand-700 transition-colors"
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

        {/* DIVIDER */}
        <div className="mt-4 border-t border-gray-100" />

        {/* BOTTOM */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3">
          <p className="text-[11px] text-gray-400">
            © {new Date().getFullYear()} Guidely. All rights reserved.
          </p>

          <p className="text-[11px] text-gray-400">
            Built for Lebanese students with care
          </p>
        </div>

      </div>
    </footer>
  );
}