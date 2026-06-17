import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import BrainScene from './neuron/BrainScene';
import { ALL_REGION_IDS, REGION_BY_ID, THEME_REGIONS, type RegionId } from '../data/brain';
import { THEMES, THEME_BY_ID } from '../data/themes';
import type { Curiosity, ThemeId } from '../types';

const IDLE_GREY = '#6b7587'; // a region with nothing firing

function blendHex(hexes: string[]): string {
  if (hexes.length === 1) return hexes[0];
  let r = 0, g = 0, b = 0;
  for (const h of hexes) {
    const v = h.replace('#', '');
    r += parseInt(v.slice(0, 2), 16);
    g += parseInt(v.slice(2, 4), 16);
    b += parseInt(v.slice(4, 6), 16);
  }
  const n = hexes.length;
  const c = (x: number) => Math.round(x / n).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

interface Props {
  items: Curiosity[];
}

export default function NeuronView({ items }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<RegionId | null>(null);

  const itemById = useMemo(() => new Map(items.map((it) => [it.id, it])), [items]);
  const selectedKey = useMemo(() => [...selectedIds].sort().join(','), [selectedIds]);

  // Each selected (and the hovered) quest contributes its theme colour to the
  // regions it trains. More quests selected → more regions light up.
  const { levelOf, colorOf } = useMemo(() => {
    const contrib = new Map<RegionId, string[]>();
    const add = (theme: ThemeId) => {
      const col = THEME_BY_ID[theme].star;
      for (const r of THEME_REGIONS[theme]) {
        const arr = contrib.get(r) ?? [];
        arr.push(col);
        contrib.set(r, arr);
      }
    };
    for (const id of selectedIds) {
      const it = itemById.get(id);
      if (it) add(it.theme);
    }
    if (previewId && !selectedIds.has(previewId)) {
      const it = itemById.get(previewId);
      if (it) add(it.theme);
    }

    const level = {} as Record<RegionId, number>;
    const color = {} as Record<RegionId, string>;
    for (const id of ALL_REGION_IDS) {
      const cols = contrib.get(id);
      if (cols && cols.length) {
        level[id] = 1;
        color[id] = blendHex(cols);
      } else {
        level[id] = 0;
        color[id] = IDLE_GREY;
      }
    }
    return { levelOf: level, colorOf: color };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey, previewId, itemById]);

  const total = ALL_REGION_IDS.length;
  const firing = ALL_REGION_IDS.filter((id) => levelOf[id] > 0);
  const dark = ALL_REGION_IDS.filter((id) => levelOf[id] === 0);

  const itemsByTheme = useMemo(() => {
    const map = new Map<ThemeId, Curiosity[]>();
    for (const t of THEMES) map.set(t.id, []);
    for (const it of items) map.get(it.theme)?.push(it);
    return map;
  }, [items]);

  function toggleTheme(themeId: ThemeId) {
    const ids = (itemsByTheme.get(themeId) ?? []).map((it) => it.id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allOn = ids.every((id) => next.has(id));
      for (const id of ids) (allOn ? next.delete(id) : next.add(id));
      return next;
    });
  }

  const hoveredRegionInfo = hoveredRegion ? REGION_BY_ID[hoveredRegion] : null;

  return (
    <div className="flex h-[calc(100dvh-150px)] min-h-[460px] flex-col gap-3 px-4 pb-4 lg:flex-row lg:px-6">
      {/* 3D brain */}
      <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_40%,#141d3a_0%,#070a18_70%)]">
        <Canvas camera={{ position: [2.7, 1.0, 3.3], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <BrainScene levelOf={levelOf} colorOf={colorOf} onHoverRegion={setHoveredRegion} />
        </Canvas>

        <div className="pointer-events-none absolute left-3 top-3 text-[11px] text-slate-400">
          drag to rotate · scroll to zoom · right-drag to pan
        </div>

        {hoveredRegionInfo && (
          <div className="pointer-events-none absolute bottom-3 left-3 max-w-[260px] rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 backdrop-blur">
            <p className="text-sm font-semibold text-white">{hoveredRegionInfo.name}</p>
            <p className="text-xs text-slate-300/80">{hoveredRegionInfo.blurb}</p>
          </div>
        )}

        {/* coverage meter */}
        <div className="absolute right-3 top-3 w-44 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 backdrop-blur">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] uppercase tracking-wide text-slate-400">regions firing</span>
            <span className="text-sm font-bold text-cyan-300">
              {firing.length}/{total}
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all"
              style={{ width: `${(firing.length / total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* side panel */}
      <aside className="flex min-h-0 w-full flex-1 flex-col rounded-2xl border border-white/10 bg-slate-950/40 lg:w-[340px] lg:flex-none">
        <div className="border-b border-white/10 p-4">
          <h2 className="font-display text-lg font-bold text-white">Rewire the network</h2>
          <p className="mt-1 text-xs text-slate-400">
            Tap a theme to fire the regions its quests train — stack several and watch more of the brain light up.
            Variety is how it stays plastic and sharp.
          </p>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-300">
              <span className="font-semibold text-white">{selectedIds.size}</span> selected ·{' '}
              <span className="font-semibold text-cyan-300">{firing.length}/{total}</span> firing
            </span>
            {selectedIds.size > 0 && (
              <button onClick={() => setSelectedIds(new Set())} className="text-slate-400 underline hover:text-slate-200">
                clear
              </button>
            )}
          </div>

          {firing.length === 0 ? (
            <p className="mt-2 text-xs text-slate-400">Nothing firing yet — tap a theme to light it up.</p>
          ) : dark.length > 0 ? (
            <p className="mt-2 text-xs text-amber-300/90">
              Still dark: {dark.map((id) => REGION_BY_ID[id].name).join(', ')}.
            </p>
          ) : (
            <p className="mt-2 text-xs text-emerald-300/90">Whole brain lit. Full workout. 🧠⚡</p>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {THEMES.map((theme) => {
            const themeItems = itemsByTheme.get(theme.id) ?? [];
            if (themeItems.length === 0) return null;
            const allOn = themeItems.every((it) => selectedIds.has(it.id));
            return (
              <div key={theme.id} className="mb-1">
                <button
                  onClick={() => toggleTheme(theme.id)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-white/5"
                  title="Select / clear all in this theme"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: theme.star, boxShadow: allOn ? `0 0 8px ${theme.star}` : 'none' }}
                  />
                  <span className="text-xs font-semibold" style={{ color: theme.ink }}>
                    {theme.label}
                  </span>
                  <span className="ml-auto text-[10px] text-slate-500">{allOn ? 'clear all' : 'all'}</span>
                </button>
                <ul>
                  {themeItems.map((it) => {
                    const isSel = selectedIds.has(it.id);
                    return (
                      <li key={it.id}>
                        <div
                          onMouseEnter={() => setPreviewId(it.id)}
                          onMouseLeave={() => setPreviewId((p) => (p === it.id ? null : p))}
                          className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-[13px] transition-colors ${
                            isSel ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          <span
                            className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] border text-[9px]"
                            style={{
                              borderColor: isSel ? theme.star : '#475569',
                              backgroundColor: isSel ? theme.star : 'transparent',
                              color: '#0b1020',
                            }}
                          >
                            {isSel ? '✓' : ''}
                          </span>
                          <span className="truncate">{it.title}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
