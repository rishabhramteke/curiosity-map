import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import type { Recommendation, RecommendationDraft } from '../types/recommendation';

const COLLECTION = 'recommendations';
const LS_KEY = 'curiosity-map.recs.v1';
const LS_EVENT = 'curiosity-rec-changed';

interface SerializedRec {
  id: string;
  curiosityId: string;
  body: string;
  authorName?: string;
  createdAt: string;
}

export function isDemoMode(): boolean {
  return !isFirebaseConfigured;
}

export async function addRecommendation(draft: RecommendationDraft): Promise<void> {
  const body = draft.body.trim();
  if (!body) throw new Error('A recommendation is required.');
  if (body.length > 500) throw new Error('Recommendation must be 500 characters or fewer.');

  const authorName = draft.authorName?.trim();
  if (authorName && authorName.length > 40) {
    throw new Error('Name must be 40 characters or fewer.');
  }

  if (db) {
    await addDoc(collection(db, COLLECTION), {
      curiosityId: draft.curiosityId,
      body,
      ...(authorName ? { authorName } : {}),
      createdAt: serverTimestamp(),
    });
    return;
  }

  // Demo mode — save to localStorage and notify any open listeners.
  const all = readLocal();
  all.push({
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    curiosityId: draft.curiosityId,
    body,
    authorName,
    createdAt: new Date().toISOString(),
  });
  writeLocal(all);
  window.dispatchEvent(new Event(LS_EVENT));
}

export function listenForRecommendations(
  curiosityId: string,
  onChange: (recs: Recommendation[]) => void
): () => void {
  if (db) {
    const q = query(
      collection(db, COLLECTION),
      where('curiosityId', '==', curiosityId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snap) => {
      const recs: Recommendation[] = snap.docs.map((d) => {
        const data = d.data() as {
          curiosityId: string;
          body: string;
          authorName?: string;
          createdAt?: Timestamp;
        };
        return {
          id: d.id,
          curiosityId: data.curiosityId,
          body: data.body,
          authorName: data.authorName,
          createdAt: data.createdAt?.toDate() ?? new Date(),
        };
      });
      onChange(recs);
    });
  }

  // Demo mode — read once + listen for the local mutation event.
  const update = () => {
    const recs: Recommendation[] = readLocal()
      .filter((r) => r.curiosityId === curiosityId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((r) => ({ ...r, createdAt: new Date(r.createdAt) }));
    onChange(recs);
  };
  update();
  const handler = () => update();
  window.addEventListener(LS_EVENT, handler);
  return () => window.removeEventListener(LS_EVENT, handler);
}

function readLocal(): SerializedRec[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SerializedRec[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(recs: SerializedRec[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(recs));
  } catch {
    /* quota / privacy mode — ignore */
  }
}
