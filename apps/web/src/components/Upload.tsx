import { useRef, useState, type ReactNode } from 'react';
import { UploadCloud } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export function Upload({ onUpload, busy, beforeDropzone }: { onUpload:(file:File,title:string)=>void; busy:boolean; beforeDropzone?: ReactNode }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const accept = (file?: File) => { if (file) onUpload(file, file.name.replace(/\.[^.]+$/, '')); };
  return <div className="empty-stage">
    <h1>{t('uploadHeroTitle', 'Khmer captions SRT')}</h1>
    <p className="lead">{t('uploadHeroLead', 'Drop in a video, generate captions, review, and export.')}</p>
    {beforeDropzone}
    <button aria-label={t('chooseVideoOrAudio', 'Choose a video or audio file')} className={`dropzone ${drag?'drag':''}`} onClick={()=>ref.current?.click()}
      onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)}
      onDrop={e=>{e.preventDefault();setDrag(false);accept(e.dataTransfer.files[0])}} disabled={busy}>
      <UploadCloud size={34}/><strong>{busy ? t('uploading', 'Uploading…') : t('chooseVideoOrAudio', 'Choose a video or audio file')}</strong><span>{t('dragOrBrowse', 'Drag it here, or click to browse · MP4, MOV, MP3, WAV and more')}</span>
    </button>
    <input ref={ref} hidden type="file" accept="video/*,audio/*" onChange={e=>accept(e.target.files?.[0])}/>
  </div>;
}
