import { useEffect, useMemo, useState } from 'react';
import ConstellationMap from './components/ConstellationMap';
import DetailPanel from './components/DetailPanel';
import Legend from './components/Legend';
import { ITEMS } from './data/items';
import { THEMES } from './data/themes';
import type { Curiosity, Status, ThemeId } from './types';

export default function App() {
  const [size, setSize] = useState({ w: 1000, h: 640 });
  const [selected, setSelected] = useState<Curiosity | null>(null);
  const [visibleThemes, setVisibleThemes] = useState<Set<ThemeId>>(
    () => new Set(THEMES.map((t) => t.id))
  );

  useEffect(() => {
    const update = () => {
      const w = Math.max(640, window.innerWidth);
      const h = Math.max(420, Math.min(window.innerHeight - 96, 820));
      setSize({ w, h });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const visibleItems = useMemo(
    () => ITEMS.filter((it) => visibleThemes.has(it.theme)),
    [visibleThemes]
  );

  const totalsByStatus = useMemo<Record<Status, number>>(() => {
    const acc: Record<Status, number> = { idea: 0, doing: 0, done: 0 };
    for (const it of ITEMS) acc[it.status]++;
    return acc;
  }, []);

  function toggleTheme(id: ThemeId) {
    setVisibleThemes((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      // never let the user blank the map entirely
      if (next.size === 0) return new Set(THEMES.map((t) => t.id));
      return next;
    });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <header className="relative z-10 mx-auto max-w-6xl px-6 pt-8 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300/80">
          a personal sky
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-white sm:text-4xl">
          Curiosity Map ✦
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-300/80">
          Things I want to do, places I want to go, side quests, sparks. Each star is a curiosity;
          each constellation is a theme.
        </p>
      </header>

      <main className="relative">
        <div className="absolute inset-x-0 top-0 z-0">
          <ConstellationMap
            items={visibleItems}
            width={size.w}
            height={size.h}
            onSelect={setSelected}
            selectedId={selected?.id ?? null}
          />
        </div>

        {/* spacer so layout reserves the SVG height */}
        <div style={{ height: size.h }} />

        {/* legend overlay */}
        <div className="pointer-events-none absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
          <Legend
            visibleThemes={visibleThemes}
            onToggleTheme={toggleTheme}
            totalsByStatus={totalsByStatus}
          />
        </div>
      </main>

      {selected && <DetailPanel item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
