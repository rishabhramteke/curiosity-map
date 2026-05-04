import type { Curiosity } from '../types';

// Edit this file to make the map yours. Each item becomes a star.
// The `theme` decides which constellation it joins; `status` decides its size.
export const ITEMS: Curiosity[] = [
  // ─── AI & data ────────────────────────────────────────────────────────
  {
    id: 'ai-mri',
    title: 'Work with MRI data',
    description:
      'Open MRI segmentation. fastMRI dataset, learn the physics of MR acquisition along the way — k-space, undersampling, all of it.',
    theme: 'ai',
    status: 'idea',
  },
  {
    id: 'ai-mbti',
    title: 'MBTI as a dataset',
    description:
      'Treat personality as multimodal data. Embed responses, compare against HEXACO/Big-Five, see what falls out of the noise.',
    theme: 'ai',
    status: 'idea',
  },
  {
    id: 'ai-perception',
    title: 'Perception systems (CV / ML)',
    description:
      'Camera + lidar + sensor fusion. Train something small that grounds language in real driving / scene frames.',
    theme: 'ai',
    status: 'idea',
  },
  {
    id: 'ai-vla',
    title: 'Try a VLA model',
    description:
      'Fine-tune something open like OpenVLA on a tiny task. See how brittle / un-brittle vision-language-action really is.',
    theme: 'ai',
    status: 'idea',
  },
  {
    id: 'ai-poi',
    title: 'POI / place data routing',
    description:
      'Build a routing engine over real-world places. Spatial joins, time-of-day priors, demand signals. The kind of stack delivery apps run on.',
    theme: 'ai',
    status: 'idea',
  },
  {
    id: 'ai-conf',
    title: 'Visit AI conferences',
    description:
      'NeurIPS / CVPR / ICRA / IROS. Pick one a year. Even better: submit a workshop paper, however small.',
    theme: 'ai',
    status: 'idea',
  },
  {
    id: 'ai-paper',
    title: 'One ML paper a week',
    description:
      'Pick something recent from arXiv. Write a one-paragraph summary. Don\'t pretend to read more than you actually do.',
    theme: 'ai',
    status: 'idea',
  },
  {
    id: 'ai-leetcode',
    title: 'Stay sharp on coding (LeetCode habit)',
    description:
      'Steady, not crammed. A few problems a week. Goal isn\'t grind — it\'s not letting the muscle atrophy.',
    theme: 'ai',
    status: 'idea',
  },

  // ─── Music ────────────────────────────────────────────────────────────
  {
    id: 'mus-vinyl',
    title: 'Buy a vinyl player + start a collection',
    description:
      'Album as a ritual, not a playlist. Looking for a starter turntable + speakers, and recommendations for first records.',
    theme: 'music',
    status: 'doing',
  },
  {
    id: 'mus-playlists',
    title: 'Sort my Spotify + craft roadtrip playlists',
    description:
      'Untangle the mega-playlist into properly-themed ones. Then curate roadtrip mixes — South America, Camino, anywhere with hours of road ahead.',
    theme: 'music',
    status: 'idea',
  },
  {
    id: 'mus-fair',
    title: 'Visit a record fair',
    description:
      'Crate-digging, talking to old vinyl heads. Probably the Utrecht one if I can swing it.',
    theme: 'music',
    status: 'idea',
  },

  // ─── Travel ───────────────────────────────────────────────────────────
  {
    id: 'trv-camino',
    title: 'Walk Camino de Santiago this year',
    description:
      'French Way most likely. ~30 days on foot. Bring the journal, leave the laptop.',
    theme: 'travel',
    status: 'doing',
  },
  {
    id: 'trv-southam',
    title: 'Backpack across South America',
    description:
      'Slow, no fixed plan. Probably starts in Bogotá and ends... somewhere south. Months, not weeks.',
    theme: 'travel',
    status: 'idea',
  },
  {
    id: 'trv-tromso',
    title: 'WFH from Tromsø during aurora season',
    description:
      'Late Jan – early March. Two or three weeks. Northern lights as a daily commute.',
    theme: 'travel',
    status: 'idea',
  },
  {
    id: 'trv-spanish',
    title: 'Brush up Spanish before South America',
    description:
      'Italki + Pimsleur combo. Goal: hold a real conversation before I land, not just order food.',
    theme: 'travel',
    status: 'idea',
  },
  {
    id: 'trv-journal',
    title: 'Travel journal with strangers\' entries',
    description:
      'A small notebook I hand to people I meet — let them write whatever. A paper trail of encounters instead of a camera roll of selfies.',
    theme: 'travel',
    status: 'idea',
  },
  {
    id: 'trv-artifacts',
    title: 'Collect artifacts, not fridge magnets',
    description:
      'One meaningful object per trip. A bowl, a textile, an instrument — something with a story attached, not a souvenir.',
    theme: 'travel',
    status: 'idea',
  },

  // ─── Pages ────────────────────────────────────────────────────────────
  {
    id: 'pag-novel',
    title: 'Write a novel as Ariel Vikingson',
    description:
      'Pen name keeps it playful. Outline first, draft second. Nordic ache, slow prose. No deadline yet — just start.',
    theme: 'pages',
    status: 'idea',
  },
  {
    id: 'pag-list',
    title: 'Build a reading list',
    description:
      'I don\'t know what to read next. Recommend me anything — fiction, philosophy, weird non-fiction, all welcome.',
    theme: 'pages',
    status: 'idea',
  },
  {
    id: 'pag-fairytales',
    title: 'Collect a fairy-tale book from every country I visit',
    description:
      'Local folk and fairy tales, picked up wherever I land. Original language is fine — illustrated counts. A shelf of other people\'s stories.',
    theme: 'pages',
    status: 'idea',
  },

  // ─── Making ───────────────────────────────────────────────────────────
  {
    id: 'mak-printer',
    title: 'Buy a 3D printer',
    description:
      'Bambu A1 mini is the obvious pick. Print only useful things for the first month before letting myself print Yodas.',
    theme: 'making',
    status: 'idea',
  },
  {
    id: 'mak-blender',
    title: 'Learn Blender for printing',
    description:
      'Modeling > slicing. One small object a week. Donut tutorial first, then something useful for the house.',
    theme: 'making',
    status: 'idea',
  },
  {
    id: 'mak-keyboard',
    title: 'Build another custom keyboard',
    description:
      'Different layout this time — maybe an Alice or 40%. Splurge on a properly wild keycap set, hand-wire if I have the patience.',
    theme: 'making',
    status: 'idea',
  },
  {
    id: 'mak-house',
    title: 'Renovate the house, room by room',
    description:
      'Just bought it. Kitchen first, then bathrooms. Live with it for a while before deciding the rest. No rush.',
    theme: 'making',
    status: 'doing',
  },
  {
    id: 'mak-house-print',
    title: 'Print useful things for the house',
    description:
      'Cable holders, drawer dividers, weird brackets. Once the printer arrives, scratch every "I wish there was a thing for…" itch.',
    theme: 'making',
    status: 'idea',
  },

  // ─── Wishlist ─────────────────────────────────────────────────────────
  {
    id: 'wsh-mx5',
    title: 'Mazda MX-5',
    description:
      'NA or NB. Manual. Probably second-hand and not red. The little roadster keeps showing up in my head — no rush, find the right one.',
    theme: 'wishlist',
    status: 'idea',
  },
  {
    id: 'wsh-espresso',
    title: 'A proper espresso machine',
    description:
      'For the new house. Step up from a Bambino — Lelit, Profitec, something I\'ll grow into. Stop renting espresso from cafés.',
    theme: 'wishlist',
    status: 'idea',
  },
  {
    id: 'wsh-300mm',
    title: '300mm lens for the Sony a6400',
    description:
      'Already have the 135mm. A 300 unlocks wildlife, distant mountains, candid street. Probably the Sony 70-350 G or the Tamron 70-300.',
    theme: 'wishlist',
    status: 'idea',
  },

  // ─── Movement ─────────────────────────────────────────────────────────
  {
    id: 'mov-rapier',
    title: 'Stay in rapier, enter a tournament',
    description:
      'Already in. Goal this year: one tournament, regardless of result. Show up, get hit, learn.',
    theme: 'movement',
    status: 'doing',
  },
  {
    id: 'mov-tennis',
    title: 'Play tennis weekly',
    description:
      'Already on it. Aim for a regular partner so it doesn\'t fall to "if the weather is right".',
    theme: 'movement',
    status: 'doing',
  },
  {
    id: 'mov-skate',
    title: 'Ice skate more often',
    description:
      'Public sessions once a month, then maybe lessons. The goal is gliding, not speed.',
    theme: 'movement',
    status: 'idea',
  },
  {
    id: 'mov-bollywood',
    title: 'Try a Bollywood dance class',
    description:
      'One trial class. Zero expectations. Just see if the joy survives the awkwardness.',
    theme: 'movement',
    status: 'idea',
  },
  {
    id: 'mov-salsa',
    title: 'Try salsa',
    description:
      'A beginner social once. See if it sticks. Allowed to be terrible.',
    theme: 'movement',
    status: 'idea',
  },
  {
    id: 'mov-kickbox',
    title: 'Try kickboxing',
    description:
      'Trial class somewhere local. Sweat ≠ drudgery. See if it scratches the rapier itch in a different shape.',
    theme: 'movement',
    status: 'idea',
  },
  {
    id: 'mov-photo',
    title: 'Lean into photography',
    description:
      'Sony a6400 + 135mm already in the bag. Shoot on purpose, not just when traveling — one walk-and-shoot a week, even at home.',
    theme: 'movement',
    status: 'doing',
  },

  // ─── Social ───────────────────────────────────────────────────────────
  {
    id: 'soc-events',
    title: 'Show up at more social events',
    description:
      'Default to yes. Even when tired. Especially when tired. Don\'t let the introvert default win every time.',
    theme: 'social',
    status: 'idea',
  },
  {
    id: 'soc-strangers',
    title: 'Talk to one new person a week',
    description:
      'Coffee shop chat, gym hello, party intro. Keep it light. No agenda.',
    theme: 'social',
    status: 'idea',
  },
  {
    id: 'soc-board',
    title: 'More board games — find a group',
    description:
      'Recurring game night, or join an existing one. Heavy euros, light party games, both fine.',
    theme: 'social',
    status: 'idea',
  },
  {
    id: 'soc-dinner',
    title: 'Host a dinner once a quarter',
    description:
      'Five people max. One recipe to perfect. Cook, don\'t cater.',
    theme: 'social',
    status: 'idea',
  },
];
