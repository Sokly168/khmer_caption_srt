import { useEffect, useRef } from 'react';
import {
  BookOpenCheck,
  HelpCircle,
  History,
  KeyRound,
  ListTodo,
  MoreHorizontal,
  RefreshCw,
  Replace,
  Search,
  Settings2,
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface WorkspaceToolsMenuProps {
  activeJobs: number;
  pendingCorrections: number;
  llmConfigured: boolean;
  replaceDisabled: boolean;
  onGuide(): void;
  onCorrect(): void;
  onHistory(): void;
  onJobs(): void;
  onCorrections(): void;
  onReplace(): void;
  onSettings(): void;
  onUpdates(): void;
}

export function WorkspaceToolsMenu({
  activeJobs,
  pendingCorrections,
  llmConfigured,
  replaceDisabled,
  onGuide,
  onCorrect,
  onHistory,
  onJobs,
  onCorrections,
  onReplace,
  onSettings,
  onUpdates,
}: WorkspaceToolsMenuProps) {
  const { t } = useLanguage();
  const details = useRef<HTMLDetailsElement | null>(null);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (details.current?.open && target && !details.current.contains(target)) details.current.removeAttribute('open');
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') details.current?.removeAttribute('open');
    };
    document.addEventListener('pointerdown', close);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', close);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, []);
  const run = (action: () => void) => {
    details.current?.querySelector('summary')?.focus();
    details.current?.removeAttribute('open');
    action();
  };
  const attentionCount = activeJobs + pendingCorrections + (llmConfigured ? 0 : 1);

  return <details ref={details} className="workspace-tools-menu">
    <summary aria-label={t('tools', 'Tools')}>
      <MoreHorizontal size={17}/><span>{t('tools', 'Tools')}</span>
      {attentionCount > 0 && <b className="tool-badge">{attentionCount}</b>}
    </summary>
    <div className="workspace-tools-popover" role="menu">
      <div className="tools-menu-intro"><strong>{t('projectTools', 'Project tools')}</strong><span>{t('projectToolsDesc', 'Less-used actions stay here so the editor remains calm.')}</span></div>
      <div className="tools-menu-section">
        <span>{t('editAndReview', 'Edit and review')}</span>
        <button role="menuitem" onClick={() => run(onCorrect)}><Search size={16}/><span><b>{t('correctEverywhere', 'Correct everywhere')}</b><small>{t('correctEverywhereDesc', 'Find repeated wording safely')}</small></span></button>
        <button role="menuitem" onClick={() => run(onHistory)}><History size={16}/><span><b>{t('history', 'History')}</b><small>{t('historyDesc', 'Restore an earlier checkpoint')}</small></span></button>
      </div>
      <div className="tools-menu-section">
        <span>{t('activity', 'Activity')}</span>
        <button role="menuitem" onClick={() => run(onJobs)}><ListTodo size={16}/><span><b>{t('processingJobs', 'Processing jobs')}</b><small>{activeJobs ? `${activeJobs} currently active` : t('processingJobsDesc', 'Progress and recovery')}</small></span>{activeJobs > 0 && <em>{activeJobs}</em>}</button>
        <button role="menuitem" onClick={() => run(onCorrections)}><BookOpenCheck size={16}/><span><b>{t('correctionInbox', 'Correction inbox')}</b><small>{t('correctionInboxDesc', 'Approve what Studio should remember')}</small></span>{pendingCorrections > 0 && <em>{pendingCorrections}</em>}</button>
      </div>
      <div className="tools-menu-section">
        <span>{t('projectAndSetup', 'Project and setup')}</span>
        <button role="menuitem" disabled={replaceDisabled} onClick={() => run(onReplace)}><Replace size={16}/><span><b>{t('replaceMedia', 'Replace media')}</b><small>{replaceDisabled ? 'Wait for the active job to finish' : t('replaceMediaDesc', 'Use a newer CapCut export')}</small></span></button>
        <button role="menuitem" onClick={() => run(onGuide)}><HelpCircle size={16}/><span><b>{t('quickGuide', 'Quick guide')}</b><small>{t('quickGuideDesc', 'See the simple first workflow')}</small></span></button>
        <button role="menuitem" onClick={() => run(onUpdates)}><RefreshCw size={16}/><span><b>{t('checkForUpdates', 'Check for updates')}</b><small>{t('checkForUpdatesDesc', 'Review signed Studio releases')}</small></span></button>
        <button role="menuitem" onClick={() => run(onSettings)}><Settings2 size={16}/><span><b>{t('settings', 'Settings')}</b><small>{llmConfigured ? t('settingsDescConnected', 'Connected · profile and system') : t('settingsDescMissing', 'Connection setup required')}</small></span>{!llmConfigured && <KeyRound size={14} className="tools-warning-icon"/>}</button>
      </div>
    </div>
  </details>;
}
