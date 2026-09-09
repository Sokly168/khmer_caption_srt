import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './hooks/useLanguage';
import { installCaptionMediaClock } from './media-clock';
import { initAppLifecycle } from './lifecycle';
import './workspace-tool-strip.css';
import { ContributionPromptHost } from './components/ContributionPromptHost';
import { PrivacyUpgradeHost } from './components/PrivacyUpgradeHost';

initAppLifecycle();

const root = document.getElementById('root')!;
installCaptionMediaClock(root);
createRoot(root).render(
  <StrictMode>
    <LanguageProvider>
      <App/>
      <PrivacyUpgradeHost/>
      <ContributionPromptHost/>
    </LanguageProvider>
  </StrictMode>,
);
