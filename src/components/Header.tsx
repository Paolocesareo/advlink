import Link from 'next/link';
import MobileMenu from './MobileMenu';

const navLinks = [
  { href: '/editori', label: 'Editori' },
  { href: '/inserzionisti', label: 'Inserzionisti' },
  { href: '/chi-siamo', label: 'Chi siamo' },
  { href: '/contatti', label: 'Contatti' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label="Advlink — home"
          className="flex items-center gap-2"
        >
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Advlink
          </span>
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-brand-800"
          />
        </Link>

        <nav
          aria-label="Navigazione principale"
          className="hidden md:block"
        >
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-slate-700 transition-colors hover:text-brand-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:hidden">
          <MobileMenu links={navLinks} />
        </div>
      </div>
    </header>
  );
}
