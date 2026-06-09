import { App, UpdateTimeline, FAQ } from '../types';

export const initialCategories = [
  'All',
  'Productivity',
  'Tools',
  'AI',
  'Games',
  'Utilities',
  'Social'
];

export const initialApps: App[] = [
  {
    id: 'nova-ai',
    name: 'Nova AI Assistant',
    slug: 'nova-ai',
    version: '2.4.1',
    category: 'AI',
    size: '18.4 MB',
    rating: 4.8,
    downloads: 12450,
    shortDescription: 'Futuristic AI assistant with live voice intelligence, search grounding, and smart workspace widgets.',
    description: 'Nova is a professional next-generation voice-enabled AI companion. Built and optimized for high-performance mobile architectures, it handles complex task scheduling, document summaries, quick coding advice, and voice conversations without any latency.\n\nFeaturing an immersive glass interface, Nova syncs across your devices and brings a beautiful widget collection to your Android home screen. Ask questions, analyze text files, or generate stunning artwork instantly.',
    developer: 'Aether Lab Industries',
    lastUpdated: '2026-05-28',
    compatibility: 'Android 10.0 or higher',
    features: [
      'Advanced language understanding with regional accents support.',
      'Offline-enabled voice recognition and sound spatialization.',
      'Direct system integrations for tasks, notes, and calendar automation.',
      'Beautiful widgets conforming to Nothing OS & iOS widgets theme styling.',
      'Direct document export in Markdown, PDF, and HTML formats.'
    ],
    permissions: [
      'Microphone (for voice input and speech synthesis)',
      'Storage access (to analyze files, documents, and pictures)',
      'Calendar read & write (to program schedule tasks)',
      'Internet (for search grounding queries)'
    ],
    whatsNew: 'Added Google Search Grounding for highly accurate real-time results. Fixed widget refresh issue on Android 14. Performance optimizations for offline translations.',
    apkUrl: 'nova_ai_v2.4.1.apk',
    iconUrl: 'nova-ai-icon',
    screenshots: ['sc-nova-1', 'sc-nova-2', 'sc-nova-3'],
    isFeatured: true,
    releaseDate: '2026-01-15',
    reviews: [
      { id: 'rev-n1', rating: 5, comment: 'Absolutely incredible! The live voice intelligence is lightning fast and helpful.', author: 'Lucas Sterling', date: '2026-06-02' },
      { id: 'rev-n2', rating: 4, comment: 'Sleek interface. The widgets fit my minimalist homescreen perfectly.', author: 'Sarah Connor', date: '2026-05-30' }
    ]
  },
  {
    id: 'task-pulse',
    name: 'TaskPulse Client',
    slug: 'task-pulse',
    version: '1.8.0',
    category: 'Productivity',
    size: '12.1 MB',
    rating: 4.5,
    downloads: 8900,
    shortDescription: 'Liquid-glass kanban, agenda, and habit tracking space with nested subtasks.',
    description: 'Structure your day with absolute visual precision. TaskPulse merges a high-fidelity linear agenda, visual Kanban cards, and micro-habits into a single unified space. Underneath its frosty glass UI lies an offline database that updates in real-time if a connection becomes active.',
    developer: 'Voxel Design Group',
    lastUpdated: '2026-06-02',
    compatibility: 'Android 9.0 or higher',
    features: [
      'Intelligent drag-and-drop workflow visualizer.',
      'Subtask branching with custom progress tracking indices.',
      'Visual priority nodes in radiant liquid gradients.',
      'Dynamic charts showing completion analytics and productivity streaks.',
      'Local private encryption for personal folders.'
    ],
    permissions: [
      'Notifications (to ping for upcoming agendas)',
      'Storage (to export data sheets/backups)',
      'External Vibration feedback (optimized haptic impulses)'
    ],
    whatsNew: 'Completely redesigned habit tracker page with glowing streak lines and custom colors config. Expanded notification filters.',
    apkUrl: 'task_pulse_v1.8.0.apk',
    iconUrl: 'task-pulse-icon',
    screenshots: ['sc-pulse-1', 'sc-pulse-2', 'sc-pulse-3'],
    isFeatured: false,
    releaseDate: '2026-02-10',
    reviews: [
      { id: 'rev-t1', rating: 5, comment: 'The nested subtasks and linear agenda are exactly what I needed to organize my day.', author: 'Elena Rostova', date: '2026-06-03' },
      { id: 'rev-t2', rating: 4, comment: 'Amazing drag and drop workflow. Love the offline database feature.', author: 'Alex Rivera', date: '2026-05-25' }
    ]
  },
  {
    id: 'retro-quest',
    name: 'RetroQuest Emulator',
    slug: 'retro-quest',
    version: '3.0.4',
    category: 'Games',
    size: '34.2 MB',
    rating: 4.9,
    downloads: 24300,
    shortDescription: 'Premium arcade & retro console emulator with multi-touch layouts and low-latency audio.',
    description: 'Relive the golden age of classic pixel adventures. RetroQuest features a highly balanced software rendering engine combined with hardware OpenGL acceleration. Customize virtual buttons with glass feedback, link bluetooth controllers instantly, and enjoy real-time save states with cloud synchronization.',
    developer: 'Synaptic Retro Co.',
    lastUpdated: '2026-05-15',
    compatibility: 'Android 8.0 or higher',
    features: [
      'Supports NES, SNES, GBA, Genesis, and Classic Arcade formats.',
      'Custom liquid-skin button mapping overlays with variable transparency.',
      'Instant load and save states with automatic screenshot previews.',
      'Zero-latency spatial audio engine with 16-bit upscaling.',
      'Net-play support to host multiplayer retro games over Local Wi-Fi.'
    ],
    permissions: [
      'Storage access (to load ROM catalogs and save states)',
      'Bluetooth / Location (for external controller pairing)',
      'Network (for Local Wi-Fi multiplayer)'
    ],
    whatsNew: 'Added SNES SuperFX game acceleration chip support. Integrated dual-shock vibration on external controller nodes. Reduced power usage by 15%.',
    apkUrl: 'retro_quest_emu_v3.0.4.apk',
    iconUrl: 'retro-quest-icon',
    screenshots: ['sc-retro-1', 'sc-retro-2', 'sc-retro-3'],
    isFeatured: true,
    releaseDate: '2025-08-20',
    reviews: [
      { id: 'rev-r1', rating: 5, comment: 'Runs classic GBA and SNES games flawlessly at solid 60fps. Haptic controls are highly responsive!', author: 'Marcus Brody', date: '2026-05-20' },
      { id: 'rev-r2', rating: 5, comment: 'Zero-latency audio engine makes a massive difference in arcade games.', author: 'Zack S.', date: '2026-05-18' }
    ]
  },
  {
    id: 'dev-gate',
    name: 'DevGate Terminal',
    slug: 'dev-gate',
    version: '1.2.5',
    category: 'Utilities',
    size: '22.6 MB',
    rating: 4.7,
    downloads: 6540,
    shortDescription: 'Local sandboxed development workspace, shell terminal, and SSH/SFTP client.',
    description: 'DevGate brings a full-fledged development sandbox directly to your phone. Connect to your remote nodes, manage containers, execute terminal scripts, and write code in a fully syntax-highlighted editor. Ideal for engineering on-the-go with custom key binds and full SSH keys provisioning.',
    developer: 'Pixel Kernel Systems',
    lastUpdated: '2026-06-05',
    compatibility: 'Android 11.0 or higher',
    features: [
      'Multi-session concurrent tab terminals with customizable monospaced typography.',
      'Full-featured SFTP directory explorer to edit files directly on remote nodes.',
      'Syntax highlights for JavaScript, Python, Go, Rust, C, and HTML/CSS.',
      'Import, manage, and passphrase-protect your SSH private keys.',
      'Custom interactive keyboard utility bar for quick-access developers keys.'
    ],
    permissions: [
      'Network / Internet (for remote server hookups)',
      'Clipboard access (for quick script copying and pasting)',
      'Vibration (for terminal error alerts)'
    ],
    whatsNew: 'Integrated an ultra-low latency canvas renderer. Custom keybindings customizer menu. Expanded SSH cipher suite compatibility.',
    apkUrl: 'dev_gate_term_v1.2.5.apk',
    iconUrl: 'dev-gate-icon',
    screenshots: ['sc-dev-1', 'sc-dev-2', 'sc-dev-3'],
    isFeatured: false,
    releaseDate: '2026-03-01',
    reviews: [
      { id: 'rev-d1', rating: 5, comment: 'The SFTP directory explorer lets me quickly hotfix code on my server. Super robust SSH client.', author: 'Devon Lane', date: '2026-06-04' }
    ]
  },
  {
    id: 'aura-meditate',
    name: 'Aura Premium Spaces',
    slug: 'aura-meditate',
    version: '1.14.0',
    category: 'Social',
    size: '45.0 MB',
    rating: 4.6,
    downloads: 14200,
    shortDescription: 'Breathe, reflect, and synchronize ambient sounds inside collaborative glass chambers.',
    description: 'Aura is a shared sanctuary. Combining therapeutic deep breathing timers with customizable spatial sounds, Aura helps you unplug, find deep focus, or rest gracefully. Join interactive sound rooms with global participants to cultivate peace together.',
    developer: 'Somnio Mindworks',
    lastUpdated: '2026-05-20',
    compatibility: 'Android 9.0 or higher',
    features: [
      'Adaptive ambient sound generator that evolves based on weather indices.',
      'Shared group meditation chambers with real-time breathing visuals.',
      'Offline mode to listen to curated high-fidelity sound loops.',
      'Intuitive graphical journals with customizable privacy credentials.',
      'Sleep analytics sync with popular smart wearable layers.'
    ],
    permissions: [
      'Audio / Music management (for background listening loops)',
      'Internet permissions (for collaborative sound chambers)'
    ],
    whatsNew: 'Added "Solstice Ambient Synth" loop. Improved offline tracking mechanism. Beautiful widgets are now available on the launcher.',
    apkUrl: 'aura_spaces_meditate_v1.14.0.apk',
    iconUrl: 'aura-meditate-icon',
    screenshots: ['sc-aura-1', 'sc-aura-2', 'sc-aura-3'],
    isFeatured: false,
    releaseDate: '2025-11-05',
    reviews: [
      { id: 'rev-a1', rating: 5, comment: 'A shared sanctuary indeed. Beautiful breathing bubble synchronization.', author: 'Sienna Wilde', date: '2026-05-24' }
    ]
  }
];

export const initialUpdates: UpdateTimeline[] = [
  {
    id: 'up-1',
    appId: 'dev-gate',
    appName: 'DevGate Terminal',
    appIcon: 'dev-gate-icon',
    version: '1.2.5',
    date: '2026-06-05',
    type: 'minor',
    changes: [
      'Upgraded terminal shell engine with custom canvas rendering pipelines.',
      'Added full compatibility with Android 15 core keyboard haptic nodes.',
      'Updated SSH cipher suites to support latest modern key encryptions.',
      'Fixed screen redraw flicker on large tablets.'
    ]
  },
  {
    id: 'up-2',
    appId: 'task-pulse',
    appName: 'TaskPulse Client',
    appIcon: 'task-pulse-icon',
    version: '1.8.0',
    date: '2026-06-02',
    type: 'major',
    changes: [
      'Completely redesigned the Habit Tracker system using real-time liquid lines.',
      'Created five pre-configured gradient palettes to style agenda groups.',
      'Implemented JSON export/import modules for localized backups.',
      'Fixed subtask drag sorting triggers.'
    ]
  },
  {
    id: 'up-3',
    appId: 'nova-ai',
    appName: 'Nova AI Assistant',
    appIcon: 'nova-ai-icon',
    version: '2.4.1',
    date: '2026-05-28',
    type: 'patch',
    changes: [
      'Resolved intermittent API key handshakes in low-signal status zones.',
      'Fixed home screen widget text alignment issues.',
      'Added immediate localized Spanish, French, and Japanese voice patches.'
    ]
  },
  {
    id: 'up-4',
    appId: 'aura-meditate',
    appName: 'Aura Premium Spaces',
    appIcon: 'aura-meditate-icon',
    version: '1.14.0',
    date: '2026-05-20',
    type: 'minor',
    changes: [
      'Introduced "Solstice Ambient Synth", an interactive spatial background track.',
      'Enhanced synchronization speed inside public meditation chat rooms.',
      'Optimized memory consumption under sleep loops.'
    ]
  },
  {
    id: 'up-5',
    appId: 'retro-quest',
    appName: 'RetroQuest Emulator',
    appIcon: 'retro-quest-icon',
    version: '3.0.4',
    date: '2026-05-15',
    type: 'major',
    changes: [
      'Enabled SNES SuperFX-based cartridge game accelerators.',
      'Configured multi-button layouts with glass-ripple haptic touch points.',
      'Reduced device temperature throttling via frame limit caps.'
    ]
  }
];

export const initialFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How do I manually install these APK files on my Android device?',
    answer: '1. Download the APK file from the application details panel.\n2. Tap the file in your notification bar or find it under File Manager > Downloads.\n3. If prompted, enable "Allow installations from this source" for your browser, then tap "Install".'
  },
  {
    id: 'faq-2',
    question: 'Are all applications distributed on this platform safe and audited?',
    answer: 'Absolutely. Every app is compiled directly from secure source code and verified with Google Play Protect to ensure zero trackers or malware. You can cross-verify the secure SHA-256 signatures in the app details view.'
  },
  {
    id: 'faq-3',
    question: 'How do I receive updates when a new app version becomes available?',
    answer: 'Simply download and run the latest APK installer from the platform. Your Android system automatically recognizes it as a safe upgrade and preserves all your application settings and offline local databases.'
  },
  {
    id: 'faq-4',
    question: 'What is the minimum compatible Android version required to run these apps?',
    answer: 'Most applications support Android 8.0 (API Level 26) or higher. You can quickly doublecheck the exact minimum Android OS requirement under the Information section inside the specific application details view.'
  }
];
