import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import BrainScene from './neuron/BrainScene';
import { ALL_REGION_IDS, REGION_BY_ID, THEME_REGIONS, type RegionId } from '../data/brain';
import { THEMES, THEME_BY_ID } from '../data/themes';
import type { Curiosity, ThemeId } from '../types';

const IDLE_GREY = '#B5A7AA'; // a region with nothing firing: pale ink on paper

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
    <div className="flex h-[calc(100dvh-190px)] min-h-[460px] flex-col gap-3 px-[var(--gutter)] pb-[var(--gutter)] lg:flex-row">
      {/* 3D brain */}
      <div className="relative min-h-[320px] flex-1 overflow-hidden border-[1.5px] border-rule bg-[radial-gradient(circle_at_50%_42%,#F4F5F2_0%,#EDEFEC_55%,#E2E5E1_100%)]">
        <Canvas camera={{ position: [2.7, 1.0, 3.3], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <BrainScene levelOf={levelOf} colorOf={colorOf} onHoverRegion={setHoveredRegion} />
        </Canvas>

        <div className="pointer-events-none absolute left-3 top-3 font-serif text-[0.85rem] italic text-ink2">
          Drag to turn it, scroll to zoom, right-drag to pan.
        </div>

        {hoveredRegionInfo && (
          <div className="pointer-events-none absolute bottom-3 left-3 max-w-[280px] border-[1.5px] border-rule bg-paper px-3.5 py-2.5">
            <p className="m-0 text-[0.95rem] font-semibold text-ink">{hoveredRegionInfo.name}</p>
            <p className="m-0 mt-0.5 font-serif text-[0.88rem] italic text-ink2">{hoveredRegionInfo.blurb}</p>
          </div>
        )}

        {/* coverage meter */}
        <div className="absolute right-3 top-3 w-48 border-[1.5px] border-rule bg-paper px-3.5 py-2.5">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-wine">Regions firing</span>
            <span className="font-display text-[1.05rem] font-semibold tabular-nums text-winedeep">
              {firing.length}/{total}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full bg-paper2" role="presentation">
            <div className="h-full bg-wine transition-[width] duration-500" style={{ width: `${(firing.length / total) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* side panel */}
      <aside className="flex min-h-0 w-full flex-1 flex-col border-[1.5px] border-rule bg-paper lg:w-[360px] lg:flex-none">
        <div className="border-b border-rulesoft p-4">
          <h2 className="m-0 text-[1.5rem]">Rewire the network</h2>
          <p className="mb-0 mt-1.5 font-serif text-[0.95rem] leading-snug text-ink2">
            Tap a theme to fire the regions its curiosities train. Stack several and watch more of the brain light up.
            Variety is how it stays plastic and sharp.
          </p>

          <div className="mt-3 flex items-center justify-between text-[0.9rem]">
            <span className="text-ink2">
              <span className="font-semibold tabular-nums text-ink">{selectedIds.size}</span> selected ·{' '}
              <span className="font-semibold tabular-nums text-winedeep">{firing.length}/{total}</span> firing
            </span>
            {selectedIds.size > 0 && (
              <button type="button" onClick={() => setSelectedIds(new Set())} className="font-semibold text-winedeep underline decoration-wine/45 underline-offset-[0.18em] hover:text-wine">
                Clear
              </button>
            )}
          </div>

          {firing.length === 0 ? (
            <p className="mb-0 mt-2 font-serif text-[0.9rem] italic text-ink2">Nothing firing yet. Tap a theme to light it up.</p>
          ) : dark.length > 0 ? (
            <p className="mb-0 mt-2 font-serif text-[0.9rem] italic text-ink2">
              Still dark: {dark.map((id) => REGION_BY_ID[id].name).join(', ')}.
            </p>
          ) : (
            <p className="mb-0 mt-2 font-serif text-[0.9rem] italic text-winedeep">Whole brain lit. Full workout.</p>
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
                  type="button"
                  onClick={() => toggleTheme(theme.id)}
                  aria-pressed={allOn}
                  className="flex w-full items-center gap-2.5 px-2 py-1.5 text-left transition-colors duration-200 hover:bg-winedeep/[0.06]"
                  title="Select or clear every curiosity in this theme"
                >
                  <span aria-hidden="true" className={`h-2.5 w-2.5 border-[1.5px] border-winedeep ${allOn ? 'bg-winedeep' : ''}`} />
                  <span className="font-display text-[0.95rem] font-semibold uppercase tracking-[0.12em] text-winedeep">
                    {theme.label}
                  </span>
                  <span className="ml-auto font-serif text-[0.82rem] italic text-ink2">{allOn ? 'Clear all' : 'All'}</span>
                </button>
                <ul>
                  {themeItems.map((it) => {
                    const isSel = selectedIds.has(it.id);
                    return (
                      <li key={it.id}>
                        <div
                          onMouseEnter={() => setPreviewId(it.id)}
                          onMouseLeave={() => setPreviewId((p) => (p === it.id ? null : p))}
                          className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[0.92rem] transition-colors duration-200 ${
                            isSel ? 'bg-winedeep/[0.08] text-ink' : 'text-ink2 hover:bg-winedeep/[0.05]'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center border-[1.5px] border-winedeep ${isSel ? 'bg-winedeep text-paper' : ''}`}
                          >
                            {isSel && (
                              <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
                                <path d="M2.5 6.2 L5 8.6 L9.5 3.6" />
                              </svg>
                            )}
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
