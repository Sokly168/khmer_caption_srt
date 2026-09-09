import { useEffect, useRef, useState } from 'react';
import type { AppProfile, SystemDoctorReport, TopicPack, TranscriptionContext } from '@kcs/shared';
import type { LlmConnectionTest, LlmSettingsStatus, SaveLlmSettingsInput } from '../api';
import { Clipboard, Download, FileUp, Globe, HeartPulse, KeyRound, Languages, PackagePlus, Play, Save, Trash2, X } from 'lucide-react';
import { AiSettingsPanel } from './AiSettingsPanel';
import { ContributorSettings } from './ContributorSettings';
import { useLanguage } from '../hooks/useLanguage';
import './contribution.css';

export type SettingsTab = 'ai' | 'profile' | 'privacy' | 'doctor' | 'language';

interface ProfileDoctorProps {
  open: boolean;
  initialTab: SettingsTab;
  llmSettings: LlmSettingsStatus;
  profile: AppProfile;
  doctor: SystemDoctorReport | null;
  busy: boolean;
  currentContext: TranscriptionContext | null;
  onClose(): void;
  onSave(patch: Partial<AppProfile>): void | Promise<void>;
  onImport(profile: AppProfile): void;
  onRunDoctor(): void;
  onApplyPack(pack: TopicPack): void;
  onSaveLlm(input: SaveLlmSettingsInput): Promise<LlmSettingsStatus>;
  onTestLlm(input: { apiKey?: string; model?: string }): Promise<LlmConnectionTest>;
  onForgetLlm(): Promise<LlmSettingsStatus>;
}

export function ProfileDoctor({
  open,
  initialTab,
  llmSettings,
  profile,
  doctor,
  busy,
  currentContext,
  onClose,
  onSave,
  onImport,
  onRunDoctor,
  onApplyPack,
  onSaveLlm,
  onTestLlm,
  onForgetLlm,
}: ProfileDoctorProps) {
  const { lang, setLang, t } = useLanguage();
  const [tab, setTab] = useState<SettingsTab>(initialTab);
  const [glossary, setGlossary] = useState(profile.defaultVocabulary.join('\n'));
  const [packName, setPackName] = useState('');
  const importRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => setGlossary(profile.defaultVocabulary.join('\n')), [profile.defaultVocabulary]);
  useEffect(() => {
    if (open) {
      if (initialTab === 'profile' || initialTab === 'privacy' || initialTab === 'doctor') {
        setTab('ai');
      } else {
        setTab(initialTab);
      }
    }
  }, [open, initialTab]);
  if (!open) return null;

  const saveGlossary = () => onSave({
    defaultVocabulary: glossary.split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
  });
  const createPack = () => {
    if (!currentContext || !packName.trim()) return;
    const now = new Date().toISOString();
    const pack: TopicPack = {
      id: crypto.randomUUID(),
      name: packName.trim(),
      description: currentContext.description,
      vocabulary: currentContext.vocabulary,
      createdAt: now,
      updatedAt: now,
    };
    onSave({ topicPacks: [...profile.topicPacks, pack] });
    setPackName('');
  };
  const removePack = (id: string) => onSave({ topicPacks: profile.topicPacks.filter((pack) => pack.id !== id) });
  const importFile = async (file?: File) => {
    if (!file) return;
    try {
      onImport(JSON.parse(await file.text()) as AppProfile);
    } catch {
      alert('That file is not a valid Sthang Studio profile JSON.');
    }
  };
  const copyDoctor = async () => {
    if (!doctor) return;
    await navigator.clipboard.writeText(JSON.stringify(doctor, null, 2));
  };

  return <div className="modal-backdrop" onMouseDown={onClose}>
    <section className="modal profile-modal" onMouseDown={(event) => event.stopPropagation()}>
      <div className="modal-head">
        <div><strong>{t('settingsTitle', 'Settings')}</strong><span>{t('settingsSub', 'Connect AI, manage your creator profile and privacy, or run a system check.')}</span></div>
        <button className="icon-btn" onClick={onClose}><X size={18}/></button>
      </div>
      <div className="modal-tabs settings-tabs">
        <button className={tab === 'ai' ? 'selected' : ''} onClick={() => setTab('ai')}><KeyRound size={14}/>{t('tabAi', 'AI connection')}</button>
        <button className={tab === 'language' ? 'selected' : ''} onClick={() => setTab('language')}><Languages size={14}/>{t('tabLanguage', 'Language')}</button>
      </div>

      {tab === 'ai' ? <AiSettingsPanel settings={llmSettings} onSave={onSaveLlm} onTest={onTestLlm} onForget={onForgetLlm}/> : tab === 'profile' ? <div className="profile-body">
        <div className="profile-stats">
          <div><b>{profile.defaultVocabulary.length}</b><span>{t('statGlobalTerms', 'global terms')}</span></div>
          <div><b>{profile.correctionRules.length}</b><span>{t('statApprovedRules', 'approved rules')}</span></div>
          <div><b>{profile.correctionEvents.length}</b><span>{t('statCorrectionEvents', 'correction events')}</span></div>
          <div><b>{profile.topicPacks.length}</b><span>{t('statTopicPacks', 'topic packs')}</span></div>
        </div>
        <label className="context-field"><span>{t('globalVocabulary', 'Global protected vocabulary')}</span><textarea rows={9} value={glossary} onChange={(event) => setGlossary(event.target.value)} placeholder={'GPT 5.6 Luna\nTerra | ថេរ៉ា\nCapCut'}/></label>
        <div className="profile-actions">
          <button disabled={busy} onClick={saveGlossary}><Save size={15}/>{t('saveGlossary', 'Save glossary')}</button>
          <a href="/api/profile/export" download><Download size={15}/>{t('exportProfile', 'Export profile')}</a>
          <button onClick={() => importRef.current?.click()}><FileUp size={15}/>{t('importProfile', 'Import profile')}</button>
          <input ref={importRef} hidden type="file" accept="application/json,.json" onChange={(event) => importFile(event.target.files?.[0])}/>
        </div>

        <div className="topic-pack-section">
          <div className="section-title"><div><strong>{t('topicPacks', 'Topic packs')}</strong><span>{t('topicPacksSub', 'Save the current context + vocabulary as a reusable pack.')}</span></div></div>
          {currentContext && <div className="pack-create"><input value={packName} onChange={(event) => setPackName(event.target.value)} placeholder="Example: AI / Coding"/><button disabled={!packName.trim() || busy} onClick={createPack}><PackagePlus size={15}/>{t('saveProjectAsPack', 'Save current project as pack')}</button></div>}
          <div className="pack-list">{profile.topicPacks.length === 0 && <span className="muted-copy">{t('noTopicPacks', 'No topic packs yet.')}</span>}{profile.topicPacks.map((pack) => <div className="pack-card" key={pack.id}><div><strong>{pack.name}</strong><span>{pack.vocabulary.length} terms · {pack.description || 'No description'}</span></div><button onClick={() => onApplyPack(pack)}><Play size={14}/>{t('apply', 'Apply')}</button><button className="danger-quiet" onClick={() => removePack(pack.id)}><Trash2 size={14}/></button></div>)}</div>
        </div>
      </div> : tab === 'privacy' ? <ContributorSettings profile={profile} busy={busy} onSave={onSave}/> : tab === 'doctor' ? <div className="doctor-body">
        <div className="doctor-intro"><HeartPulse size={24}/><div><strong>{t('systemCheckTitle', 'System check')}</strong><span>{t('systemCheckSub', 'Checks the app, media tools, caption timing, AI connection, and local storage. It never includes your API key.')}</span></div><button className="primary" disabled={busy} onClick={onRunDoctor}>{t('runChecks', 'Run checks')}</button></div>
        {!doctor && <div className="modal-empty"><HeartPulse size={28}/><strong>{t('noReportYet', 'No report yet')}</strong><span>{t('noReportSub', 'Run the check after installing on a new PC or whenever caption generation fails.')}</span></div>}
        {doctor && <>
          <div className={`doctor-summary doctor-${doctor.overall}`}><strong>{doctor.overall === 'ok' ? 'Everything important is ready' : doctor.overall === 'warning' ? 'Ready with warnings' : 'Setup needs attention'}</strong><span>{new Date(doctor.generatedAt).toLocaleString()} · {doctor.environment.platform} · Node {doctor.environment.node}</span><button onClick={copyDoctor}><Clipboard size={14}/>{t('copyDiagnostic', 'Copy diagnostic report')}</button></div>
          <div className="doctor-checks">{doctor.checks.map((item) => <div className={`doctor-check check-${item.status}`} key={item.id}><i/>
            <div><strong>{item.label}</strong><span>{item.detail}</span>{item.fix && <em>{item.fix}</em>}</div>
          </div>)}</div>
        </>}
      </div> : <div className="doctor-body" style={{ padding: '24px' }}>
        <div className="doctor-intro" style={{ marginBottom: '20px' }}>
          <Globe size={24}/>
          <div>
            <strong>{t('tabLanguage', 'Language')}</strong>
            <span>{t('languageSelectLabel', 'Interface language')}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <button
            type="button"
            className={`lang-option-card ${lang === 'km' ? 'active' : ''}`}
            onClick={() => setLang('km')}
          >
            <span>🇰🇭 ភាសាខ្មែរ (Khmer)</span>
            {lang === 'km' && <span className="active-badge">Active</span>}
          </button>
          <button
            type="button"
            className={`lang-option-card ${lang === 'en' ? 'active' : ''}`}
            onClick={() => setLang('en')}
          >
            <span>🇬🇧 English</span>
            {lang === 'en' && <span className="active-badge">Active</span>}
          </button>
        </div>
      </div>}
    </section>
  </div>;
}

