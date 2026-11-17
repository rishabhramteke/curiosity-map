import type { Curiosity } from '../types';

// Edit this file to make the map yours. Each item becomes a star.
// The `theme` decides which constellation it joins; `status` decides its size.
export const ITEMS: Curiosity[] = [
  // ─── AI & data ────────────────────────────────────────────────────────
  {
    id: 'ai-mri',
    title: 'Get back to MRI data',
    description:
      'I clustered diffusion-MRI fibre tracts and reconstructed MRI images as a student (see Projects). Next round: fastMRI, rebuilding images from undersampled k-space with today\'s models, and learning the acquisition physics properly this time.',
    theme: 'ai',
    status: 'todo',
    link: '/project',
  },
  {
    id: 'ai-mbti',
    title: 'MBTI as a dataset',
    description:
      'Treat personality as multimodal data. Embed responses, compare against HEXACO/Big-Five, see what falls out of the noise.',
    theme: 'ai',
    status: 'todo',
  },
  {
    id: 'ai-vla',
    title: 'Try a vision-language-action model',
    description:
      'Fine-tune an open one like OpenVLA on a tiny task and ground it in real driving and street-scene frames. See how brittle vision, language and action really are once they meet a camera.',
    theme: 'ai',
    status: 'todo',
  },
  {
    id: 'ai-poi',
    title: 'POI / place data routing',
    description:
      'Build a routing engine over real-world places. Spatial joins, time-of-day priors, demand signals. The kind of stack delivery apps run on.',
    theme: 'ai',
    status: 'todo',
  },
  {
    id: 'ai-conf',
    title: 'Visit AI conferences',
    description:
      'NeurIPS, CVPR, ICRA or IROS. Pick one a year and go in person: talks in the morning, posters in the afternoon, strangers\' research over dinner.',
    theme: 'ai',
    status: 'todo',
  },
  {
    id: 'ai-paper',
    title: 'Write papers',
    description:
      'Less reading, more writing. Workshop paper, then main track, then write-ups that punch above their weight; the embed2heights and flight-price write-ups on the site are a start. One submission a year, even a small one.',
    theme: 'ai',
    status: 'todo',
    link: '/project',
  },
  {
    id: 'ai-leetcode',
    title: 'Stay sharp on coding (LeetCode habit)',
    description:
      'Steady, not crammed: a few problems a week so the muscle never wastes away. My 100-page study guide of top patterns and Uber-style problems is linked below.',
    theme: 'ai',
    status: 'todo',
    link: '/curiosity-map/uber_leetcode.pdf',
  },
  {
    id: 'ai-stupidapp',
    title: 'Build a stupid app just for friends',
    description:
      'No business model, no roadmap. A potluck-tracker, a cocktail-name generator from our group chat, something that makes five people laugh. Pure laughter ROI.',
    theme: 'ai',
    status: 'todo',
  },

  // ─── Music ────────────────────────────────────────────────────────────
  {
    id: 'mus-vinyl',
    title: 'Buy a vinyl player and start a collection',
    description:
      'The player is in, and the records live on my record shelf. Albums as a ritual, not a playlist; recommendations for the next ones are very welcome.',
    theme: 'music',
    status: 'done',
    link: '/records',
  },
  {
    id: 'mus-playlists',
    title: 'Sort my Spotify and craft road-trip playlists',
    description:
      'Untangle the mega-playlist into properly themed ones, then curate road-trip mixes for South America and anywhere else with hours of road ahead.',
    theme: 'music',
    status: 'todo',
  },
  {
    id: 'mus-fair',
    title: 'Visit a record fair',
    description:
      'Crate-digging, talking to old vinyl heads. Probably the Utrecht one if I can swing it.',
    theme: 'music',
    status: 'todo',
  },

  // ─── Travel ───────────────────────────────────────────────────────────
  {
    id: 'trv-camino',
    title: 'Walk the Camino de Santiago',
    description:
      'Walked it. The compostela is in the bag, and it is half of the Dual Pilgrim certificate I am going for on the Kumano Kodo in March 2027.',
    theme: 'travel',
    status: 'done',
    link: '/camino-de-santiago',
  },
  {
    id: 'trv-southam',
    title: 'Backpack across South America',
    description:
      'Slow, no fixed plan. Probably starts in Bogotá and ends... somewhere south. Months, not weeks.',
    theme: 'travel',
    status: 'todo',
  },
  {
    id: 'trv-tromso',
    title: 'WFH from Tromsø during aurora season',
    description:
      'Late Jan – early March. Two or three weeks. Northern lights as a daily commute.',
    theme: 'travel',
    status: 'todo',
  },
  {
    id: 'trv-spanish',
    title: 'Brush up Spanish before South America',
    description:
      'Italki + Pimsleur combo. Goal: hold a real conversation before I land, not just order food.',
    theme: 'travel',
    status: 'todo',
  },
  {
    id: 'trv-journal',
    title: 'Travel journal with strangers\' entries',
    description:
      'A small notebook I hand to people I meet so they can write whatever they like, in their own language. A paper trail of encounters instead of a camera roll of selfies. It started on the Camino in 2026.',
    theme: 'travel',
    status: 'doing',
    link: '/travel-diary',
  },
  {
    id: 'trv-artifacts',
    title: 'Collect artifacts, not fridge magnets',
    description:
      'One meaningful object per trip. A bowl, a textile, an instrument — something with a story attached, not a souvenir.',
    theme: 'travel',
    status: 'todo',
  },
  {
    id: 'trv-interrail',
    title: 'Plan interrail trips',
    description:
      'Slow Europe by rail: a book, a new city every few days, no flights. Probably summer routes, Lisbon to Porto to San Sebastián, or a Balkans loop.',
    theme: 'travel',
    status: 'todo',
  },
  {
    id: 'trv-allcontinents',
    title: 'Step on all 7 continents',
    description:
      'Three down: Asia, Europe and Australia. Africa (Tunisia) and South America are next on this map, and Antarctica is the final boss. No schedule, no rush.',
    theme: 'travel',
    status: 'doing',
    link: '/travel',
  },
  {
    id: 'trv-cargo',
    title: 'Take a cargo ship across an ocean',
    description:
      'Two weeks at sea, no wifi, just books and the wake. Hardly anyone travels this way any more, which is exactly the point.',
    theme: 'travel',
    status: 'todo',
  },
  {
    id: 'trv-spicy',
    title: 'Eat the spiciest local dish in every country I visit',
    description:
      'Sweat it out, cry into the napkin, take notes. Sichuan first, Korea second. The hotter the better — collect the receipts.',
    theme: 'travel',
    status: 'todo',
  },
  {
    id: 'trv-noplan',
    title: 'Travel for two weeks with no plan',
    description:
      'Buy the ticket the morning of. Wherever it lands, that\'s where I go. Pack a bag, leave a note, see what happens.',
    theme: 'travel',
    status: 'todo',
  },

  // ─── Travel · Seoul ──────────────────────────
  {
    id: 'seo-bbq',
    title: 'Korean BBQ + soju at 2am in Hongdae',
    description:
      'Grill thick belly pork at the table, wrap with garlic and ssamjang, soju shot, repeat. Find strangers at the next table by 1am. Lost-voice by 3am. Earned ramyeon by 4am.',
    theme: 'travel',
    status: 'todo',
  },
  {
    id: 'seo-jjimjilbang',
    title: 'Sleep overnight at a jjimjilbang',
    description:
      'Hot rooms, cold rooms, salt rooms, the egg-shaped hwangto kiln. Eat boiled eggs and shikhye in pyjamas. Pass out on a wooden pillow. Cheaper than a hostel, weirder than camping.',
    theme: 'travel',
    status: 'todo',
  },
  {
    id: 'seo-bukhansan',
    title: 'Sunrise hike up Bukhansan',
    description:
      'Granite peaks above Seoul. Headlamp in the dark, sky pinking by the time the summit is in view. Breakfast at the top — kimbap and instant coffee, hands frozen.',
    theme: 'travel',
    status: 'todo',
  },
  {
    id: 'seo-chimaek',
    title: 'Chi-maek by the Han River',
    description:
      'Fried chicken (yangnyeom + soy garlic, both) and a cold lager, on a mat under the bridges in summer. Yeouido or Banpo. Bring friends, bring more than I think I need.',
    theme: 'travel',
    status: 'todo',
  },
  {
    id: 'seo-noraebang',
    title: 'Noraebang until the timer runs out',
    description:
      'Private karaoke room, two hours minimum. Ballads + shouty K-rock + one English song nobody knows. Tambourine compulsory. Buy the extra time when it asks.',
    theme: 'travel',
    status: 'todo',
  },

  // ─── Travel · Japan 2027: Kumano Kodo and Shikoku 88 ──────
  {
    id: 'shi-kumano',
    title: 'Walk the Kumano Kodo',
    description:
      'The Nakahechi route to the three Grand Shrines, four walking days in March 2027, just before Shikoku. With the Camino already walked, it earns the Dual Pilgrim certificate at Kumano Hongū Taisha.',
    theme: 'travel',
    status: 'todo',
    link: '/shikoku-88-trip-planning',
  },
  {
    id: 'shi-section',
    title: 'Walk all 88 temples of the Shikoku pilgrimage',
    description:
      'Planned for 2027 in two parts: temples 1 to 23 on foot through the cherry blossom in spring, then 24 to 88 in the autumn leaves, walking the dense stretches and taking the bus or train across the empty ones. White hakui, sugegasa hat and a nōkyōchō for every temple\'s seal. The full plan is in my pilgrim\'s notes.',
    theme: 'travel',
    status: 'todo',
    link: '/shikoku-88-trip-planning',
  },
  {
    id: 'shi-temple-stay',
    title: 'Sleep at a temple along the way (shukubō)',
    description:
      'At least one night in a temple lodging. Sunset bath, vegetarian shōjin-ryōri dinner, morning sutras before the next stretch. Dawn-quiet that feels like another century.',
    theme: 'travel',
    status: 'todo',
  },
  {
    id: 'shi-dogo',
    title: 'Soak at Dōgo Onsen',
    description:
      'One of Japan\'s oldest hot springs, said to be 3,000 years old, in Matsuyama, Ehime. Best as the reward at the end of an autumn henro stretch: body tired, robe loose.',
    theme: 'travel',
    status: 'todo',
  },

  // ─── Travel · Tunisia (one week) ─────────────
  {
    id: 'tun-sahara',
    title: 'A night in the Sahara',
    description:
      'Berber camp at Ksar Ghilane or near Douz. Camel out at dusk, eat by firelight, lie on my back under the Milky Way — nothing the city ever showed me. Sleep in a tent, wake to silence.',
    theme: 'travel',
    status: 'todo',
  },
  {
    id: 'tun-starwars',
    title: 'Star Wars filming-location pilgrimage',
    description:
      'Matmata troglodyte houses (the Lars homestead). Ong Jemel dunes. Tataouine (yes, the actual town). Wear something white. Take dorky photos without irony.',
    theme: 'travel',
    status: 'todo',
  },
  {
    id: 'tun-brik',
    title: 'Eat brik à l\'oeuf without breaking the yolk',
    description:
      'Crispy pastry triangle, runny egg inside. Bite, don\'t fold. The unbroken yolk is the win — the broken yolk is the lesson. A challenge for the whole table.',
    theme: 'travel',
    status: 'todo',
  },
  {
    id: 'tun-hammam',
    title: 'Scrub at a traditional hammam',
    description:
      'Steam, a kessa glove, a stranger\'s rough hands, layers of skin I did not know I had. Awkward at first, then new. Walk out lighter than I arrived.',
    theme: 'travel',
    status: 'todo',
  },

  // ─── Pages ────────────────────────────────────────────────────────────
  {
    id: 'pag-novel',
    title: 'Write a novel as Ariel Vikingson',
    description:
      'Pen name keeps it playful. Outline first, draft second. Nordic ache, slow prose. No deadline yet — just start.',
    theme: 'pages',
    status: 'todo',
  },
  {
    id: 'pag-list',
    title: 'Build a reading list',
    description:
      'I don\'t know what to read next. Recommend me anything — fiction, philosophy, weird non-fiction, all welcome.',
    theme: 'pages',
    status: 'todo',
  },
  {
    id: 'pag-fairytales',
    title: 'Collect a fairy-tale book from every country I visit',
    description:
      'Local folk and fairy tales, picked up wherever I land. Original language is fine — illustrated counts. A shelf of other people\'s stories.',
    theme: 'pages',
    status: 'todo',
  },

  // ─── Making ───────────────────────────────────────────────────────────
  {
    id: 'mak-printer',
    title: 'Buy a 3D printer',
    description:
      'A Bambu A1 mini is the obvious pick. The first month prints only useful things for the house: cable holders, drawer dividers, odd brackets, every "I wish there was a thing for…" itch. Yodas after that.',
    theme: 'making',
    status: 'todo',
  },
  {
    id: 'mak-blender',
    title: 'Use Blender more',
    description:
      'Already know the tool — the gap is shipping. One small model a week. Personal stuff, props, things to print, occasional rabbit holes.',
    theme: 'making',
    status: 'todo',
  },
  {
    id: 'mak-gallery',
    title: 'Build a portfolio page for my 3D models',
    description:
      'A small gallery on the personal site — renders, turntables, maybe an interactive viewer. Forcing function: if it has to look good in public, I\'ll finish more.',
    theme: 'making',
    status: 'todo',
  },
  {
    id: 'mak-keyboard',
    title: 'Build another custom keyboard',
    description:
      'Different layout this time — maybe an Alice or 40%. Splurge on a properly wild keycap set, hand-wire if I have the patience.',
    theme: 'making',
    status: 'todo',
  },
  {
    id: 'mak-house',
    title: 'Renovate the house, room by room',
    description:
      'Kitchen first, then the bathrooms. Live with the rest for a while before deciding. No rush.',
    theme: 'making',
    status: 'doing',
  },
  {
    id: 'mak-treehouse',
    title: 'Build a treehouse (or platform) with friends',
    description:
      'Doesn\'t have to be Pinterest-grade. A platform, a ladder, a small bench. Bring beers, bring power tools, see what we end up with by Sunday.',
    theme: 'making',
    status: 'todo',
  },
  {
    id: 'mak-tattoo',
    title: 'Get a tattoo with a real story',
    description:
      'Not a flash piece, not aesthetic — something where, when someone asks, the story takes ten minutes to tell.',
    theme: 'making',
    status: 'todo',
  },

  // ─── Wishlist ─────────────────────────────────────────────────────────
  {
    id: 'wsh-mx5',
    title: 'Mazda MX-5',
    description:
      'NA or NB. Manual. Probably second-hand and not red. The little roadster keeps showing up in my head — no rush, find the right one.',
    theme: 'wishlist',
    status: 'todo',
  },
  {
    id: 'wsh-espresso',
    title: 'A proper espresso machine',
    description:
      'For the new house. Step up from a Bambino — Lelit, Profitec, something I\'ll grow into. Stop renting espresso from cafés.',
    theme: 'wishlist',
    status: 'todo',
  },
  {
    id: 'wsh-300mm',
    title: '300mm lens for the Sony a6400',
    description:
      'Already have the 135mm. A 300 unlocks wildlife, distant mountains, candid street. Probably the Sony 70-350 G or the Tamron 70-300.',
    theme: 'wishlist',
    status: 'todo',
  },

  // ─── Movement ─────────────────────────────────────────────────────────
  {
    id: 'mov-rapier',
    title: 'Stay in rapier, enter a tournament',
    description:
      'Already training. The goal is one tournament, whatever the result: show up, get hit, learn.',
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
    status: 'todo',
  },
  {
    id: 'mov-bollywood',
    title: 'Try a Bollywood dance class',
    description:
      'One trial class. Zero expectations. Just see if the joy survives the awkwardness.',
    theme: 'movement',
    status: 'todo',
  },
  {
    id: 'mov-salsa',
    title: 'Try salsa',
    description:
      'A beginner social once. See if it sticks. Allowed to be terrible.',
    theme: 'movement',
    status: 'todo',
  },
  {
    id: 'mov-kickbox',
    title: 'Try kickboxing, then spar at an open mat',
    description:
      'A trial kickboxing class first, to see if it scratches the rapier itch in a different shape. Then an open mat at a judo or BJJ dojo: get thrown, get back up, laugh about it, bow at the end.',
    theme: 'movement',
    status: 'todo',
  },
  {
    id: 'mov-photo',
    title: 'Lean into photography',
    description:
      'Sony a6400 + 135mm already in the bag. Shoot on purpose, not just when traveling — one walk-and-shoot a week, even at home.',
    theme: 'movement',
    status: 'doing',
  },
  {
    id: 'mov-mountain',
    title: 'Climb a real mountain',
    description:
      'Kili, Toubkal, Mont Blanc — doesn\'t have to be a 7-summiter. Just one thing where the air gets thin and the photo doesn\'t do it justice.',
    theme: 'movement',
    status: 'todo',
  },
  {
    id: 'mov-surf',
    title: 'Learn to surf',
    description:
      'Drop in. Wipe out. Drop in again. A week somewhere warm — Portugal, Sri Lanka, Costa Rica — until I can stand up and ride.',
    theme: 'movement',
    status: 'todo',
  },
  {
    id: 'mov-dive',
    title: 'Dive somewhere wild',
    description:
      'The Red Sea, Indonesia, Galápagos. Get the cert if I have to, but the dive is the point — neon fish, deep blue, my own breathing in my ears.',
    theme: 'movement',
    status: 'todo',
  },
  {
    id: 'mov-skydive',
    title: 'Skydive once',
    description:
      'One tandem jump. Yell something stupid on the way down. Photo evidence is the souvenir.',
    theme: 'movement',
    status: 'todo',
  },
  {
    id: 'mov-marine',
    title: 'Find an ex-Marine and learn to fight from him',
    description:
      'Real self-defense from someone who lived it. Track one down, trade beers for lessons — striking, grappling, reading a room before it goes wrong. Less sport, more the kind that gets you home.',
    theme: 'movement',
    status: 'todo',
  },
  {
    id: 'mov-stupidskill',
    title: 'Pick up a stupid useless skill',
    description:
      'Butterfly knife flipping. Two-finger whistle. Rope spinning. Spinning a basketball on one finger. Nothing employable — pure showmanship.',
    theme: 'movement',
    status: 'todo',
  },
  {
    id: 'mov-tree',
    title: 'Climb a tree like I\'m 12 again',
    description:
      'Find a big one. Get high enough that I\'m slightly nervous. Sit there for a while. Come down before sundown.',
    theme: 'movement',
    status: 'todo',
  },

  // ─── Social ───────────────────────────────────────────────────────────
  {
    id: 'soc-events',
    title: 'Show up at more social events',
    description:
      'Default to yes. Even when tired. Especially when tired. Don\'t let the introvert default win every time.',
    theme: 'social',
    status: 'todo',
  },
  {
    id: 'soc-strangers',
    title: 'Talk to one new person a week',
    description:
      'A coffee-shop chat, a hello at the gym, an introduction at a party. Keep it light, no agenda. The Icebreaker cards on this site have opening lines and a five-minute dare.',
    theme: 'social',
    status: 'todo',
    link: '/icebreaker/',
  },
  {
    id: 'soc-board',
    title: 'Buy more board games',
    description:
      'Build the shelf. Heavy euros, light party games, and at least one weird thing. Excuse to host more nights.',
    theme: 'social',
    status: 'todo',
    link: '/board-games',
  },
  {
    id: 'soc-dinner',
    title: 'Host potluck dinners at my place',
    description:
      'Everyone brings a dish. Easier than cooking a full meal, lower pressure all round. Semi-regular cadence, the new house gets lived in.',
    theme: 'social',
    status: 'todo',
  },
  {
    id: 'soc-karaoke',
    title: 'Karaoke until 3am with strangers',
    description:
      'A bar, a song I love, a room that joins in by the chorus. Bonus points if I make a friend by the encore.',
    theme: 'social',
    status: 'todo',
  },
  {
    id: 'soc-tournament',
    title: 'Enter a tournament for anything and lose hilariously',
    description:
      'Pub quiz, eating contest, a chess club open. Show up, give everything, get destroyed, buy the winner a beer.',
    theme: 'social',
    status: 'todo',
  },
  {
    id: 'soc-openmic',
    title: 'Get on stage at an open mic',
    description:
      'Stand-up, music, poetry — anything. Bomb on purpose if I have to. Fear of doing it is the only thing in the way.',
    theme: 'social',
    status: 'todo',
  },
  {
    id: 'soc-costume',
    title: 'Throw a no-warning costume party',
    description:
      'Tell the guests it\'s casual. Hand them a costume at the door. They\'re in too deep to leave. Photos as evidence.',
    theme: 'social',
    status: 'todo',
  },
];
