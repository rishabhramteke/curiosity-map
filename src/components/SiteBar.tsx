// The same top bar as every page of rishabhramteke.github.io, so the map reads as part of the site.
const WORK = [
  ['About', '/aboutme'],
  ['Projects', '/project'],
  ['Publications', '/publications'],
  ['Patents', '/patents'],
  ['Résumé', '/assets/files/Resume.pdf'],
];
const JOURNAL = [
  ['Journal', '/#journal'],
  ['Travel', '/travel'],
  ['Contact', '/#imprint'],
];

export default function SiteBar() {
  const link = 'border-b-[1.5px] border-transparent pb-0.5 text-[0.98rem] font-medium text-ink no-underline transition-colors duration-200 hover:border-wine hover:text-wine';
  return (
    <div className="relative z-20 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-b-[1.5px] border-rule bg-paper px-[var(--gutter)] py-3.5">
      <a href="/" className="font-display text-[1.4rem] font-semibold leading-none text-winedeep no-underline hover:text-wine">
        Rishabh Ramteke
      </a>
      <nav aria-label="Site">
        <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-1 p-0">
          {WORK.map(([t, h]) => (
            <li key={h}><a className={link} href={h}>{t}</a></li>
          ))}
          {JOURNAL.map(([t, h], i) => (
            <li key={h} className={i === 0 ? 'relative sm:ml-7 sm:before:absolute sm:before:-left-6 sm:before:top-[15%] sm:before:bottom-[15%] sm:before:w-px sm:before:bg-rulesoft' : ''}>
              <a className={link} href={h}>{t}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
