import type { Curiosity } from '../types';

// Edit this file to make the map yours. Each item becomes a star.
// The `theme` decides which constellation it joins; `status` decides its size.
export const ITEMS: Curiosity[] = [
  // — AI rabbit holes —
  {
    id: 'ai-rag',
    title: 'Build a tiny RAG over my notes',
    description: 'Local-first retrieval over markdown notes. Embeddings cached, no cloud.',
    theme: 'ai',
    status: 'idea',
  },
  {
    id: 'ai-paper-club',
    title: 'Read one ML paper a week',
    description: 'Pick a recent arXiv paper, write a one-paragraph summary, post it somewhere.',
    theme: 'ai',
    status: 'doing',
  },
  {
    id: 'ai-cuda',
    title: 'Learn CUDA from scratch',
    description: 'Work through the PMPP book, port a numpy thing to a CUDA kernel.',
    theme: 'ai',
    status: 'idea',
  },
  {
    id: 'ai-jax',
    title: 'Try JAX for a real project',
    description: 'Toy LLM training loop, see what the autodiff feels like.',
    theme: 'ai',
    status: 'idea',
  },
  {
    id: 'ai-evals',
    title: 'Write an evals harness',
    description: 'Tiny tool to score Claude/GPT/Gemini on the prompts I actually use.',
    theme: 'ai',
    status: 'idea',
  },

  // — Music —
  {
    id: 'mus-modular',
    title: 'Learn modular synthesis',
    description: 'Maybe VCV Rack first, then a small Eurorack starter. Patches, not gear.',
    theme: 'music',
    status: 'idea',
  },
  {
    id: 'mus-sing',
    title: 'Take vocal lessons',
    description: 'Confidence > virtuosity. One trimester of weekly lessons.',
    theme: 'music',
    status: 'idea',
  },
  {
    id: 'mus-mix',
    title: 'Mix one track to release-quality',
    description: 'Pick something I made and finish it properly — reference tracks, mastering, the lot.',
    theme: 'music',
    status: 'doing',
  },
  {
    id: 'mus-bass',
    title: 'Pick the bass back up',
    description: '15 min a day, slap practice. No new gear allowed until I finish a song.',
    theme: 'music',
    status: 'idea',
  },
  {
    id: 'mus-concert',
    title: 'See Bonobo live',
    description: 'Watch tour dates, plan a city around it.',
    theme: 'music',
    status: 'idea',
  },

  // — Travel —
  {
    id: 'trv-patagonia',
    title: 'Patagonia in autumn',
    description: 'Torres del Paine W trek. Crowds gone, colors at peak.',
    theme: 'travel',
    status: 'idea',
  },
  {
    id: 'trv-tokyo',
    title: 'Tokyo for two weeks',
    description: 'Stay in one neighborhood, walk a lot, go to one show a night.',
    theme: 'travel',
    status: 'idea',
  },
  {
    id: 'trv-lisbon',
    title: 'Slow weekend in Lisbon',
    description: 'Pastéis, fado, walk the hills. A repeat is allowed.',
    theme: 'travel',
    status: 'done',
  },
  {
    id: 'trv-iceland',
    title: 'Iceland ring road',
    description: 'Camper, midnight sun. Maybe with a friend who likes silence.',
    theme: 'travel',
    status: 'idea',
  },
  {
    id: 'trv-trans',
    title: 'Trans-Siberian leg',
    description: 'Even just Moscow → Irkutsk. Long stretches of nothing.',
    theme: 'travel',
    status: 'idea',
  },

  // — Books —
  {
    id: 'bks-calvino',
    title: 'Invisible Cities — Calvino',
    description: 'Reread it, slowly, one city per night.',
    theme: 'books',
    status: 'doing',
  },
  {
    id: 'bks-feynman',
    title: 'Surely You\'re Joking, Mr. Feynman',
    description: 'For the playfulness. Take notes on the curiosity moves.',
    theme: 'books',
    status: 'idea',
  },
  {
    id: 'bks-borges',
    title: 'Ficciones — Borges',
    description: 'One short story a week. Talk about each one with someone.',
    theme: 'books',
    status: 'idea',
  },
  {
    id: 'bks-pkd',
    title: 'A Scanner Darkly — PKD',
    description: 'Heard it lands harder than the film.',
    theme: 'books',
    status: 'idea',
  },

  // — Tech tinkering —
  {
    id: 'tch-mech',
    title: 'Build a 40% mechanical keyboard',
    description: 'Hand-wired. Pick switches I haven\'t tried. Layout in QMK.',
    theme: 'tech',
    status: 'idea',
  },
  {
    id: 'tch-self',
    title: 'Self-host my own paste/notes',
    description: 'Tiny tailscale-only service on a home Pi. No SaaS.',
    theme: 'tech',
    status: 'idea',
  },
  {
    id: 'tch-eink',
    title: 'E-ink dashboard for my desk',
    description: 'Weather, calendar, todo. Refresh once an hour.',
    theme: 'tech',
    status: 'idea',
  },
  {
    id: 'tch-printer',
    title: 'Buy and tame a 3D printer',
    description: 'Bambu A1 mini probably. Print only useful things for a month.',
    theme: 'tech',
    status: 'idea',
  },
  {
    id: 'tch-game',
    title: 'Make a tiny browser game',
    description: 'One mechanic, one weekend. Ship it on itch.io.',
    theme: 'tech',
    status: 'doing',
  },
];
