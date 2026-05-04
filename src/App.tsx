import { useEffect, useMemo, useRef, useState } from 'react';
import ConstellationMap from './components/ConstellationMap';
import DetailPanel from './components/DetailPanel';
import Legend from './components/Legend';
import { ITEMS } from './data/items';
import { loadOverrides, subscribeOverrides } from './services/status';
import type { Curiosity, Status, ThemeId } from './types';

const POP_DURATION_MS = 2000;

export default function App() {
  const [size, setSize] = useState({ w: 1000, h: 640 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mutedThemes, setMutedThemes] = useState<Set<ThemeId>>(() => new Set());
  const [poppingTheme, setPoppingTheme] = useState<ThemeId | null>(null);
  const popTimerRef = useRef<number | null>(null);
  const [overrides, setOverrides] = useState(() => loadOverrides());

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
            items={effectiveItems}
            width={size.w}
            height={size.h}
            onSelect={(it) => setSelectedId(it.id)}
            selectedId={selected?.id ?? null}
            mutedThemes={mutedThemes}
            poppingTheme={poppingTheme}
          />
        </div>

        {/* spacer so layout reserves the SVG height */}
        <div style={{ height: size.h }} />

        {/* legend overlay */}
        <div className="pointer-events-none absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
          <Legend
            mutedThemes={mutedThemes}
            onToggleTheme={toggleTheme}
            totalsByStatus={totalsByStatus}
          />
        </div>
      </main>

      {selected && <DetailPanel item={selected} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
