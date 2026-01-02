export type Language = 'en' | 'ar'

export const translations = {
  en: {
    // App
    appName: 'Tamata',
    appTagline: 'Focus Timer',

    // Navigation
    sounds: 'Sounds',
    stats: 'Stats',
    keys: 'Keys',

    // Timer modes
    focus: 'Focus',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
    focusTime: 'Focus Time',
    ready: 'Ready',
    running: 'Running',

    // Timer controls
    reset: 'Reset',
    skip: 'Skip',

    // Session indicator
    today: 'Today',
    sessions: 'sessions',

    // Sound mixer
    ambientSounds: 'Ambient Sounds',
    noSoundsActive: 'No sounds active',
    soundPlaying: 'sound playing',
    soundsPlaying: 'sounds playing',
    mixAmbientSounds: 'Mix ambient sounds to focus',
    masterVolume: 'Master Volume',
    quickPresets: 'Quick Presets',

    // Sound categories
    rainWeather: 'Rain & Weather',
    nature: 'Nature',
    ambient: 'Ambient',
    noise: 'Noise',

    // Sound names
    lightRain: 'Light Rain',
    heavyRain: 'Heavy Rain',
    thunder: 'Thunder',
    forest: 'Forest',
    oceanWaves: 'Ocean Waves',
    birds: 'Birds',
    fireplace: 'Fireplace',
    coffeeShop: 'Coffee Shop',
    lofiBeats: 'Lo-Fi Beats',
    whiteNoise: 'White Noise',
    pinkNoise: 'Pink Noise',
    brownNoise: 'Brown Noise',

    // Presets
    rainyCafe: 'Rainy Café',
    forestRetreat: 'Forest Retreat',
    cozyFire: 'Cozy Fire',
    oceanBreeze: 'Ocean Breeze',
    deepFocus: 'Deep Focus',
    lofiRain: 'Lo-Fi & Rain',

    // Analytics
    analytics: 'Analytics',
    focusStat: 'Focus',
    sessionsStat: 'Sessions',
    breakStat: 'Break',
    dayStreak: 'Day Streak',
    bestStreak: 'Best Streak',
    thisWeek: 'This Week',
    allTimeStats: 'All-Time Stats',
    totalFocusTime: 'Total Focus Time',
    totalSessions: 'Total Sessions',
    dailyAverage: 'Daily Average',
    completedSessions: "You've completed",
    withAverage: 'with an average of',
    focusTimePerDay: 'focus time per day.',

    // Keyboard shortcuts
    keyboardShortcuts: 'Keyboard Shortcuts',
    startPause: 'Start / Pause',
    resetTimer: 'Reset Timer',
    skipSession: 'Skip Session',
    closeModal: 'Close Modal',

    // Language
    language: 'Language',
    english: 'English',
    arabic: 'العربية',

    // Random sound
    randomSound: 'Random Sound',
    playingRandom: 'Playing',
  },
  ar: {
    // App
    appName: 'تماتا',
    appTagline: 'مؤقت التركيز',

    // Navigation
    sounds: 'الأصوات',
    stats: 'الإحصائيات',
    keys: 'الاختصارات',

    // Timer modes
    focus: 'تركيز',
    shortBreak: 'استراحة قصيرة',
    longBreak: 'استراحة طويلة',
    focusTime: 'وقت التركيز',
    ready: 'جاهز',
    running: 'يعمل',

    // Timer controls
    reset: 'إعادة',
    skip: 'تخطي',

    // Session indicator
    today: 'اليوم',
    sessions: 'جلسات',

    // Sound mixer
    ambientSounds: 'الأصوات المحيطة',
    noSoundsActive: 'لا توجد أصوات نشطة',
    soundPlaying: 'صوت يعمل',
    soundsPlaying: 'أصوات تعمل',
    mixAmbientSounds: 'امزج الأصوات للتركيز',
    masterVolume: 'مستوى الصوت',
    quickPresets: 'إعدادات سريعة',

    // Sound categories
    rainWeather: 'المطر والطقس',
    nature: 'الطبيعة',
    ambient: 'محيطي',
    noise: 'ضوضاء',

    // Sound names
    lightRain: 'مطر خفيف',
    heavyRain: 'مطر غزير',
    thunder: 'رعد',
    forest: 'غابة',
    oceanWaves: 'أمواج البحر',
    birds: 'طيور',
    fireplace: 'موقد',
    coffeeShop: 'مقهى',
    lofiBeats: 'لوفاي',
    whiteNoise: 'ضوضاء بيضاء',
    pinkNoise: 'ضوضاء وردية',
    brownNoise: 'ضوضاء بنية',

    // Presets
    rainyCafe: 'مقهى ممطر',
    forestRetreat: 'ملاذ الغابة',
    cozyFire: 'دفء الموقد',
    oceanBreeze: 'نسيم البحر',
    deepFocus: 'تركيز عميق',
    lofiRain: 'لوفاي ومطر',

    // Analytics
    analytics: 'الإحصائيات',
    focusStat: 'تركيز',
    sessionsStat: 'جلسات',
    breakStat: 'استراحة',
    dayStreak: 'أيام متتالية',
    bestStreak: 'أفضل سلسلة',
    thisWeek: 'هذا الأسبوع',
    allTimeStats: 'إحصائيات كاملة',
    totalFocusTime: 'إجمالي وقت التركيز',
    totalSessions: 'إجمالي الجلسات',
    dailyAverage: 'المعدل اليومي',
    completedSessions: 'أكملت',
    withAverage: 'بمعدل',
    focusTimePerDay: 'وقت تركيز يومياً.',

    // Keyboard shortcuts
    keyboardShortcuts: 'اختصارات لوحة المفاتيح',
    startPause: 'بدء / إيقاف',
    resetTimer: 'إعادة المؤقت',
    skipSession: 'تخطي الجلسة',
    closeModal: 'إغلاق',

    // Language
    language: 'اللغة',
    english: 'English',
    arabic: 'العربية',

    // Random sound
    randomSound: 'صوت عشوائي',
    playingRandom: 'يعمل',
  },
} as const

export type TranslationKey = keyof typeof translations.en
