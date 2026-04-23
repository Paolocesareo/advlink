import Link from 'next/link';

type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
};

type FooterSection = {
  title: string;
  links: ReadonlyArray<FooterLink>;
};

const sections: ReadonlyArray<FooterSection> = [
  {
    title: 'Prodotti',
    links: [
      { href: '/editori', label: 'Editori' },
      { href: '/inserzionisti', label: 'Inserzionisti' },
    ],
  },
  {
    title: 'Azienda',
    links: [
      { href: '/chi-siamo', label: 'Chi siamo' },
      { href: '/contatti', label: 'Contatti' },
    ],
  },
  {
    title: 'Legale',
    links: [
      { href: '#', label: 'Privacy' },
      { href: '#', label: 'Cookie' },
    ],
  },
  {
    title: 'Contatti',
    links: [
      { href: 'mailto:info@advlink.it', label: 'info@advlink.it', external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-slate-900">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.label}`}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="text-sm text-slate-600 transition-colors hover:text-brand-700"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-slate-600 transition-colors hover:text-brand-700"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          {/* TODO: sostituire placeholder P.IVA con il numero reale quando disponibile */}
          <p>&copy; 2026 Advlink — P.IVA 00000000000</p>
          <p>Da editori, per editori.</p>
        </div>
      </div>
    </footer>
  );
}
