// Per-curiosity status overrides, persisted in localStorage on the visitor's
// device. The defaults in src/data/items.ts remain the public source-of-truth
// for visitors; overrides give the page owner instant private-view edits
// (TODO → Doing → Review → Done) without round-tripping through GitHub.

import type { Status } from '../types';

const KEY = 'curiosity-map.status-overrides.v1';
const EVENT = 'curiosity-status-changed';

export type OverrideMap = Record<string, Status>;

export function loadOverrides(): OverrideMap {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed ? (parsed as OverrideMap) : {};
  } catch {
    return {};
  }
}

export function setOverride(curiosityId: string, status: Status | null): void {
  const all = loadOverrides();
  if (status === null) {
    delete all[curiosityId];
  } else {
    all[curiosityId] = status;
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* quota / privacy mode — ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeOverrides(handler: () => void): () => void {
  window.addEventListener(EVENT, handler);
  // Cross-tab updates fire 'storage' on other tabs, not the originating tab.
  const storageHandler = (e: StorageEvent) => {
    if (e.key === KEY) handler();
  };
  window.addEventListener('storage', storageHandler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
}
