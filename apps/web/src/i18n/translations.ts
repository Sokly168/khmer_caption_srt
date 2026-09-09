export type Language = 'km' | 'en';

export const translations: Record<string, Record<Language, string>> = {
  // Common / Header
  tools: { en: 'Tools', km: 'ឧបករណ៍' },
  review: { en: 'Review', km: 'ផ្ទៀងផ្ទាត់' },
  saved: { en: 'Saved', km: 'បានរក្សាទុក' },
  export: { en: 'Export', km: 'នាំចេញ' },
  back: { en: 'Back', km: 'ថយក្រោយ' },
  timelineCaptions: { en: 'Timeline captions', km: 'ចំណងជើងរង Timeline' },
  reviewQueue: { en: 'Review queue', km: 'ជួរផ្ទៀងផ្ទាត់' },
  current: { en: 'Current', km: 'បច្ចុប្បន្ន' },
  follow: { en: 'Follow', km: 'តាមដាន' },
  addCaption: { en: 'Add caption', km: 'បន្ថែម Caption' },
  downloadSrt: { en: 'Download SRT', km: 'ទាញយក SRT' },
  captionedVideo: { en: 'Captioned video', km: 'វីដេអូមាន Caption' },
  captionsFile: { en: 'Captions file', km: 'ឯកសារ Captions' },
  exportNotice: {
    en: 'Caption text + timing. Visual styling stays controlled by the destination editing app.',
    km: 'អត្ថបទ Caption និងពេលវេលា។ ម៉ូតអក្សរត្រូវបានគ្រប់គ្រងដោយកម្មវិធីកាត់តរបស់អ្នក។',
  },
  exportHelp: {
    en: 'Choose the output and quality. Caption styling stays in the editor, where you can judge it on the video.',
    km: 'ជ្រើសរើសទម្រង់និងគុណភាព។ ម៉ូត Caption បង្ហាញក្នុង Editor ដើម្បីផ្ទៀងផ្ទាត់លើវីដេអូ។',
  },
  save: { en: 'Save', km: 'រក្សាទុក' },
  cancel: { en: 'Cancel', km: 'បោះបង់' },
  delete: { en: 'Delete', km: 'លុប' },
  close: { en: 'Close', km: 'បិទ' },
  apply: { en: 'Apply', km: 'អនុវត្ត' },
  connected: { en: 'Connected', km: 'បានតភ្ជាប់' },
  setupRequired: { en: 'Setup required', km: 'ត្រូវការដំឡើង' },

  // Tools Popover Menu
  projectTools: { en: 'Project tools', km: 'ឧបករណ៍គម្រោង' },
  projectToolsDesc: { en: 'Less-used actions stay here so the editor remains calm.', km: 'មុខងារបន្ថែមសម្រាប់កែសម្រួលនិងគ្រប់គ្រងគម្រោង។' },
  editAndReview: { en: 'Edit and review', km: 'កែសម្រួល និងផ្ទៀងផ្ទាត់' },
  correctEverywhere: { en: 'Correct everywhere', km: 'កែសម្រួលទាំងអស់' },
  correctEverywhereDesc: { en: 'Find repeated wording safely', km: 'ស្វែងរកនិងកែពាក្យដដែលៗដោយសុវត្ថិភាព' },
  history: { en: 'History', km: 'ប្រវត្តិ' },
  historyDesc: { en: 'Restore an earlier checkpoint', km: 'ត្រឡប់ទៅចំណុចដែលបានរក្សាទុកមុន' },
  activity: { en: 'Activity', km: 'សកម្មភាព' },
  processingJobs: { en: 'Processing jobs', km: 'ដំណើរការការងារ' },
  processingJobsDesc: { en: 'Progress and recovery', km: 'វឌ្ឍនភាពនិងការស្តារឡើងវិញ' },
  correctionInbox: { en: 'Correction inbox', km: 'ប្រអប់កែតម្រូវ' },
  correctionInboxDesc: { en: 'Approve what Studio should remember', km: 'អនុម័តពាក្យដែលត្រូវចងចាំ' },
  projectAndSetup: { en: 'Project and setup', km: 'គម្រោង និងការដំឡើង' },
  replaceMedia: { en: 'Replace media', km: 'ប្តូរវីដេអូថ្មី' },
  replaceMediaDesc: { en: 'Use a newer CapCut export', km: 'ប្រើប្រាស់វីដេអូថ្មីពី CapCut' },
  quickGuide: { en: 'Quick guide', km: 'មគ្គុទ្ទេសក៍រហ័ស' },
  quickGuideDesc: { en: 'See the simple first workflow', km: 'មើលរបៀបប្រើប្រាស់ដំបូង' },
  checkForUpdates: { en: 'Check for updates', km: 'ពិនិត្យមើលកំណែថ្មី' },
  checkForUpdatesDesc: { en: 'Review signed Studio releases', km: 'ពិនិត្យការអាប់ដេត Studio' },
  settings: { en: 'Settings', km: 'ការកំណត់' },
  settingsDescConnected: { en: 'Connected · profile and system', km: 'បានតភ្ជាប់ · គណនី និងប្រព័ន្ធ' },
  settingsDescMissing: { en: 'Connection setup required', km: 'ត្រូវការតភ្ជាប់ Gemini API' },

  // Settings Modal
  settingsTitle: { en: 'Settings', km: 'ការកំណត់' },
  settingsSub: {
    en: 'Connect AI, manage your creator profile and privacy, or run a system check.',
    km: 'តភ្ជាប់ AI, គ្រប់គ្រងព័ត៌មាន និងឯកជនភាព ឬដំណើរការត្រួតពិនិត្យប្រព័ន្ធ។',
  },
  tabAi: { en: 'AI connection', km: 'ការតភ្ជាប់ AI' },
  tabProfile: { en: 'Profile', km: 'ព័ត៌មានគណនី' },
  tabPrivacy: { en: 'Privacy', km: 'ឯកជនភាព' },
  tabDoctor: { en: 'System check', km: 'ត្រួតពិនិត្យប្រព័ន្ធ' },
  tabLanguage: { en: 'Language', km: 'ភាសា' },
  languageSelectLabel: { en: 'Interface language', km: 'ភាសាផ្ទាំងកម្មវិធី' },
  langKm: { en: 'Khmer (ភាសាខ្មែរ)', km: 'ភាសាខ្មែរ (Khmer)' },
  langEn: { en: 'English', km: 'អង់គ្លេស (English)' },

  // Settings Profile Tab
  globalVocabulary: { en: 'Global protected vocabulary', km: 'បញ្ជីពាក្យសកលដែលត្រូវការពារ' },
  saveGlossary: { en: 'Save glossary', km: 'រក្សាទុកបញ្ជីពាក្យ' },
  exportProfile: { en: 'Export profile', km: 'នាំចេញ Profile' },
  importProfile: { en: 'Import profile', km: 'នាំចូល Profile' },
  topicPacks: { en: 'Topic packs', km: 'កញ្ចប់ប្រធានបទ' },
  topicPacksSub: { en: 'Save the current context + vocabulary as a reusable pack.', km: 'រក្សាទុកបរិបទនិងបញ្ជីពាក្យជាកញ្ចប់ប្រើឡើងវិញ។' },
  saveProjectAsPack: { en: 'Save current project as pack', km: 'រក្សាទុកគម្រោងបច្ចុប្បន្នជាកញ្ចប់' },
  noTopicPacks: { en: 'No topic packs yet.', km: 'មិនទាន់មានកញ្ចប់ប្រធានបទនៅឡើយទេ។' },
  statGlobalTerms: { en: 'global terms', km: 'ពាក្យសកល' },
  statApprovedRules: { en: 'approved rules', km: 'ច្បាប់ដែលបានអនុម័ត' },
  statCorrectionEvents: { en: 'correction events', km: 'ព្រឹត្តិការណ៍កែសម្រួល' },
  statTopicPacks: { en: 'topic packs', km: 'កញ្ចប់ប្រធានបទ' },

  // System check
  systemCheckTitle: { en: 'System check', km: 'ត្រួតពិនិត្យប្រព័ន្ធ' },
  systemCheckSub: {
    en: 'Checks the app, media tools, caption timing, AI connection, and local storage. It never includes your API key.',
    km: 'ត្រួតពិនិត្យកម្មវិធី ឧបករណ៍មេឌៀ ការកំណត់ពេលវេលា AI និងទំហំផ្ទុក។ វាមិនដែលបង្ហាញ API key របស់អ្នកឡើយ។',
  },
  runChecks: { en: 'Run checks', km: 'ដំណើរការត្រួតពិនិត្យ' },
  noReportYet: { en: 'No report yet', km: 'មិនទាន់មានរបាយការណ៍នៅឡើយទេ' },
  noReportSub: { en: 'Run the check after installing on a new PC or whenever caption generation fails.', km: 'ដំណើរការត្រួតពិនិត្យក្រោយដំឡើងលើកុំព្យូទ័រថ្មី ឬពេលបង្កើត Caption មានបញ្ហា។' },
  copyDiagnostic: { en: 'Copy diagnostic report', km: 'ចម្លងរបាយការណ៍វិភាគ' },

  // Home Screen
  homeTitle: { en: 'Sthang Studio', km: 'Sthang Studio' },
  homeSub: {
    en: 'Short-form video captions with precise Khmer alignment',
    km: 'កម្មវិធីដាក់ចំណងជើងរងវីដេអូខ្លីជាមួយការតម្រឹមភាសាខ្មែរយ៉ាងច្បាស់លាស់',
  },
  uploadHeroTitle: {
    en: 'Khmer captions SRT',
    km: 'Khmer captions SRT',
  },
  uploadHeroLead: {
    en: 'Drop in a video, generate captions, review, and export.',
    km: 'ទម្លាក់វីដេអូ បង្កើត Caption ផ្ទៀងផ្ទាត់ និងទាញយកបានភ្លាមៗ។',
  },
  chooseVideoOrAudio: {
    en: 'Choose a video or audio file',
    km: 'ជ្រើសរើសឯកសារវីដេអូ ឬសំឡេង',
  },
  uploading: {
    en: 'Uploading…',
    km: 'កំពុងផ្ទុកឡើង…',
  },
  dragOrBrowse: {
    en: 'Drag it here, or click to browse · MP4, MOV, MP3, WAV and more',
    km: 'អូសទម្លាក់នៅទីនេះ ឬចុចដើម្បីរើសឯកសារ · MP4, MOV, MP3, WAV',
  },
  pillKhmerFirstText: { en: 'Khmer-first text', km: 'អត្ថបទភាសាខ្មែរ' },
  pillPreciseTiming: { en: 'Precise Khmer timing', km: 'ពេលវេលាតម្រឹមច្បាស់' },
  pillCapcutSrt: { en: 'CapCut-ready SRT', km: 'SRT សម្រាប់ CapCut' },
  recentProjects: { en: 'Recent projects', km: 'គម្រោងថ្មីៗ' },

  // Theme & Language
  toggleTheme: { en: 'Toggle light/dark theme', km: 'ប្តូរពន្លឺ / ងងឹត' },
  toggleLanguage: { en: 'Switch language (Khmer / English)', km: 'ប្តូរភាសា (ខ្មែរ / English)' },
  themeLight: { en: 'Switch to light mode', km: 'ប្តូរទៅ Light mode' },
  themeDark: { en: 'Switch to dark mode', km: 'ប្តូរទៅ Dark mode' },
  langKmShort: { en: 'ខ្មែរ', km: 'ខ្មែរ' },
  langEnShort: { en: 'EN', km: 'EN' },
};


