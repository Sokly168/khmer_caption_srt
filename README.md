# 🎬 Khmer Captions SRT (Sthang Studio)

កម្មវិធីបង្កើត និងកែសម្រួល Caption / Subtitle ភាសាខ្មែរដោយស្វ័យប្រវត្តិតាមរយៈ AI និងបច្ចេកវិទ្យា Local Timing (Khmer Forced Alignment) សម្រាប់វីដេអូ Facebook, TikTok, YouTube និង CapCut។

---

## 🚀 របៀបដំឡើង និងដំណើរការលើ Computer ថ្មី (Quick Start for New PC)

ប្រសិនបើអ្នកទើបតែទទួលបាន Folder Project នេះ ឬយកទៅប្រើប្រាស់លើ **Computer ថ្មី** សូមអនុវត្តតាមជំហានងាយៗខាងក្រោម៖

### ជំហានទី ១៖ ទាញយក ឬពន្លា File (Extract ZIP)
- ប្រសិនបើទាញយកជា ZIP សូម **Extract (ពន្លា)** ទៅកាន់ Folder ធម្មតា (ឧទាហរណ៍៖ `C:\Khmer_Caption_SRT` ឬ `Downloads\Khmer_Caption_SRT`)។
- ⚠️ **ចំណាំ**៖ សូមកុំដំណើរការកូដចេញពីក្នុង File ZIP ដោយផ្ទាល់ (ត្រូវ Extract ជាមុនសិន)។

---

### ជំហានទី ២៖ ចុចលើ `INSTALL-AND-RUN.bat` (មួយក្ដុចចប់)
ចូលទៅកាន់ Folder គម្រោង រួច **Double-click** លើ File៖

👉 **`INSTALL-AND-RUN.bat`**  *(ឬ `run-windows.bat`)*

#### ⚙️ អ្វីដែលប្រព័ន្ធនឹងធ្វើដោយស្វ័យប្រវត្តិ (100% Automated)៖
1. **ត្រួតពិនិត្យ និងដំឡើង Tools ចាំបាច់** (Node.js, Python 3.12, FFmpeg, Visual C++ Runtime) ប្រសិនបើម៉ាស៊ីនមិនទាន់មាន។
2. **ដំឡើង Packages & Libraries** ទាំងអស់សម្រាប់ Project (`npm install`)។
3. **រៀបចំប្រព័ន្ធកាត់ពាក្យ និងតម្រឹមសំឡេងខ្មែរ** (`.venv` ជាមួយ Khmer Forced Alignment - KFA & Whisper)។
4. **Build កម្មវិធី** សម្រាប់ប្រើប្រាស់ក្នុងម៉ាស៊ីន Local (`npm run build`)។
5. **បង្កើត Desktop Shortcut លើអេក្រង់** ដោយស្វ័យប្រវត្តិ ដែលមានឈ្មោះថា **`Khmer Captions SRT`** ព្រមទាំងមានរូប Icon ស្រស់ស្អាត។
6. **បើកដំណើរការកម្មវិធីភ្លាមៗ** លើ Browser (Edge / Chrome)។

---

### ជំហានទី ៣៖ កំណត់ Gemini API Key សម្រាប់បង្កើត Caption
1. នៅពេលផ្ទាំងកម្មវិធីបើកឡើង សូមចូលទៅកាន់ **Settings** (រូបកង់ធ្មេញ) ⚙️ -> **AI connection**។
2. បញ្ចូល **Gemini API Key** របស់អ្នក (អាចយកដោយឥតគិតថ្លៃពី [Google AI Studio](https://aistudio.google.com/))។
3. ចុច **Save Key** ជាការស្រេច។

---

## 💻 ការប្រើប្រាស់លើកក្រោយៗ (Everyday Usage)

នៅពេលដែលអ្នកបានដំឡើងជោគជ័យម្ដងរួចហើយ៖
- អ្នក**មិនបាច់**ចូលទៅកាន់ Folder គម្រោងដើម្បីចុច bat file ទៀតឡើយ។
- គ្រាន់តែ **Double-click លើរូប Shortcut `Khmer Captions SRT` នៅលើ Desktop** នោះកម្មវិធីនឹងបើកដំណើរការឡើងជាផ្ទាំង App ស្អាតភ្លាមៗ។
- គ្មានផ្ទាំង Terminal ឬ PowerShell ខ្មៅរំខាននៅលើ Taskbar ឡើយ។

---

## 🛑 របៀបបិទកម្មវិធី (Stop App)
ប្រសិនបើអ្នកចង់បិទ Server ឬ Service ទាំងស្រុង សូម Double-click លើ File៖
- **`STOP-STHANG-STUDIO.bat`**

---

## 📋 តម្រូវការប្រព័ន្ធ (System Requirements)
- **ប្រព័ន្ធប្រតិបត្តិការ**៖ Windows 10 ឬ Windows 11 (64-bit)
- **អ៊ីនធឺណិត**៖ ត្រូវការភ្ជាប់ Internet ពេលដំឡើងលើកដំបូង (ដើម្បីទាញយក Dependencies និង AI Model) និងពេលបញ្ជាឱ្យ AI ចាប់សំឡេងជាអក្សរ។
- **ទំហំផ្ទុកទំនេរ**៖ ប្រហែល 2 GB - 4 GB សម្រាប់ផ្ទុក Models និង Environment។

---

## 🛠️ សម្រាប់ Developer / កែប្រែកូដ (Developer Commands)

ប្រសិនបើអ្នកចង់ Run ឬអភិវឌ្ឍបន្ថែមដោយប្រើ Command Line៖

```bash
# ដំឡើង dependencies
npm install

# Setup local timing python environment
setup-local-timing-windows.bat

# Build project
npm run build

# Run development mode
npm run dev

# Run Typecheck & Tests
npm run typecheck
npm run test:update-powershell
npm run test:timing-cache
```

---
*Khmer Captions SRT - Accurate Khmer captions for creators.*
