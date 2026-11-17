import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import ConstellationMap from './components/ConstellationMap';
import DetailPanel from './components/DetailPanel';
import Legend from './components/Legend';
import SiteBar from './components/SiteBar';
import { ITEMS } from './data/items';

// three.js is heavy — only load it when the visitor opens the brain view.
const NeuronView = lazy(() => import('./components/NeuronView'));
import { loadOverrides, subscribeOverrides } from './services/status';
import type { Curiosity, Status, ThemeId } from './types';

type ViewMode = 'constellation' | 'neuron';

const POP_DURATION_MS = 2000;

export default function App() {
  const [size, setSize] = useState({ w: 1000, h: 640 });
  const [view, setView] = useState<ViewMode>('constellation');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mutedThemes, setMutedThemes] = useState<Set<ThemeId>>(() => new Set());
  const [poppingTheme, setPoppingTheme] = useState<ThemeId | null>(null);
  const popTimerRef = useRef<number | null>(null);
  const [overrides, setOverrides] = useState(() => loadOverrides());

  useEffect(() => {
    const update = () => {
      const gutter = Math.min(32, Math.max(16, window.innerWidth * 0.022));
      const w = Math.max(640, window.innerWidth - 2 * gutter - 3);
      const h = Math.max(420, Math.min(window.innerHeight - 140, 820));
      setSize({ w, h });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    return () => {
      if (popTimerRef.current) window.clearTimeout(popTimerRef.current);
    };
  }, []);

  // Listen for status overrides changing from any source (the panel button,
  // another tab, manual localStorage edit).
  useEffect(() => {
    const refresh = () => setOverrides(loadOverrides());
    return subscribeOverrides(refresh);
  }, []);

  // Items decorated with the visitor's per-device status overrides.
  const effectiveItems = useMemo<Curiosity[]>(
    () =>
      ITEMS.map((it) => ({
        ...it,
        status: overrides[it.id] ?? it.status,
      })),
    [overrides]
  );

  const totalsByStatus = useMemo<Record<Status, number>>(() => {
    const acc: Record<Status, number> = { todo: 0, doing: 0, review: 0, done: 0 };
    for (const it of effectiveItems) acc[it.status]++;
    return acc;
  }, [effectiveItems]);

  const selected = useMemo(
    () => (selectedId ? effectiveItems.find((it) => it.id === selectedId) ?? null : null),
    [effectiveItems, selectedId]
  );

  function toggleTheme(id: ThemeId) {
    setMutedThemes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        if (popTimerRef.current) window.clearTimeout(popTimerRef.current);
        setPoppingTheme(id);
        popTimerRef.current = window.setTimeout(() => {
          setPoppingTheme((cur) => (cur === id ? null : cur));
          popTimerRef.current = null;
        }, POP_DURATION_MS);
      } else {
        next.add(id);
        setPoppingTheme((cur) => (cur === id ? null : cur));
      }
      return next;
    });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-paper text-ink">
      <SiteBar />
      <header className="relative z-10 mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-x-8 gap-y-4 px-[var(--gutter)] pt-8 pb-5">
        <div>
          <h1 className="text-[clamp(2.3rem,5vw,3.6rem)] leading-none">Curiosity map</h1>
          <p className="mt-3 max-w-[60ch] font-serif text-[1.05rem] italic leading-normal text-ink2">
            {view === 'constellation'
              ? 'Things I want to learn, make and do, and places I want to go. Each star is one curiosity; each constellation is a theme.'
              : 'The same curiosities, as a brain. Every theme trains different regions. Keep them all firing to stay sharp.'}
          </p>
        </div>

        <div role="group" aria-label="View" className="flex shrink-0 border-[1.5px] border-winedeep text-[0.95rem] font-semibold">
          {(['constellation', 'neuron'] as ViewMode[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`px-4 py-2.5 transition-colors duration-200 ${
                view === v ? 'bg-winedeep text-paper' : 'text-winedeep hover:bg-winedeep/10'
              }`}
            >
              {v === 'constellation' ? 'Star chart' : 'Neuron activation'}
            </button>
          ))}
        </div>
      </header>

      {view === 'constellation' ? (
        <>
          <main className="relative mx-[var(--gutter)] mb-[var(--gutter)] border-[1.5px] border-rule">
            <div className="absolute inset-x-0 top-0 z-0">
              <ConstellationMap
                items={effectiveItems}
                width={size.w}
                height={size.h}
                onSelect={(it) => setSelectedId(it.id)}
                selectedId={selected?.id ?? null}
                mutedThemes={mutedThemes}
                poppingTheme={poppingTheme}
              />
            </div>

            {/* spacer so layout reserves the chart's drawn height at any width */}
            <div style={{ aspectRatio: `${size.w} / ${size.h}` }} />

            {/* legend: a title block over the chart on wide screens */}
            <div className="pointer-events-none absolute left-4 top-4 z-10 hidden md:block lg:left-6 lg:top-6">
              <Legend
                mutedThemes={mutedThemes}
                onToggleTheme={toggleTheme}
                totalsByStatus={totalsByStatus}
              />
            </div>
          </main>
          {/* on phones the title block follows the chart */}
          <div className="mx-[var(--gutter)] mb-[var(--gutter)] md:hidden">
            <Legend mutedThemes={mutedThemes} onToggleTheme={toggleTheme} totalsByStatus={totalsByStatus} />
          </div>

          {selected && <DetailPanel item={selected} onClose={() => setSelectedId(null)} />}
        </>
      ) : (
        <Suspense
          fallback={
            <div className="flex h-[calc(100dvh-150px)] min-h-[460px] items-center justify-center font-serif italic text-ink2">
              Waking up the neurons…
            </div>
          }
        >
          <NeuronView items={effectiveItems} />
        </Suspense>
      )}
    </div>
  );
}
