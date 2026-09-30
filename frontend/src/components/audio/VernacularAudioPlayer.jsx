import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Square, Globe } from 'lucide-react';
import { LANGUAGE_META } from '../../constants/classifications';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

export function VernacularAudioPlayer({ advisories, title = 'Statutory Multilingual Health Broadcast' }) {
  const [selectedLang, setSelectedLang] = useState('en');
  const { isPlaying, activeLang, play, stop } = useAudioPlayer();

  const currentText =
    advisories?.[selectedLang] ||
    advisories?.en ||
    'Urgent environmental advisory: elevated particulate concentrations detected downwind. Limit outdoor exposure.';

  const handleTogglePlayback = () => {
    if (isPlaying && activeLang === selectedLang) {
      stop();
    } else {
      play(currentText, selectedLang);
    }
  };

  const isCurrentPlaying = isPlaying && activeLang === selectedLang;

  return (
    <div className="bg-app-surface border border-border-subtle rounded p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-2xs text-slate-400">
          <Globe className="h-3 w-3" />
          <span>6 STATUTORY LANGUAGES</span>
        </div>
      </div>

      {/* Language Selection Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
        {LANGUAGE_META.map((lang) => {
          const isSelected = selectedLang === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setSelectedLang(lang.code);
                if (isPlaying) {
                  stop();
                }
              }}
              className={`px-2 py-1.5 rounded text-left transition-all border ${
                isSelected
                  ? 'bg-blue-950/60 border-blue-500/60 text-blue-300 shadow-sm'
                  : 'bg-app-panel/60 border-border-subtle text-slate-400 hover:text-slate-200 hover:bg-app-hover'
              }`}
            >
              <div className="text-2xs font-semibold uppercase tracking-wider">{lang.code.toUpperCase()}</div>
              <div className="text-xs font-medium truncate">{lang.nativeName}</div>
            </button>
          );
        })}
      </div>

      {/* Advisory Text Display */}
      <div className="p-3 rounded bg-app-bg border border-border-subtle/80 text-xs text-slate-300 leading-relaxed font-sans min-h-[4rem]">
        {currentText}
      </div>

      {/* Audio Playback Controls & Waveform */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <button
          type="button"
          onClick={handleTogglePlayback}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded font-mono text-xs font-semibold transition-all border ${
            isCurrentPlaying
              ? 'bg-rose-950/80 border-rose-600 text-rose-300 hover:bg-rose-900'
              : 'bg-civic border-blue-600 text-white hover:bg-civic-hover shadow-sm'
          }`}
        >
          {isCurrentPlaying ? (
            <>
              <Square className="h-3.5 w-3.5 fill-current" />
              <span>HALT BROADCAST</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>TRANSMIT AUDIO ({selectedLang.toUpperCase()})</span>
            </>
          )}
        </button>

        {/* Clean, Non-Glowing Audio Waveform Simulator */}
        <div className="flex items-center gap-1 h-6 px-3 py-1 rounded bg-app-bg border border-border-subtle">
          {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65].map((height, idx) => (
            <div
              key={idx}
              className={`w-0.5 rounded-full transition-all duration-150 ${
                isCurrentPlaying
                  ? 'bg-blue-400 animate-pulse'
                  : 'bg-slate-700'
              }`}
              style={{
                height: isCurrentPlaying ? `${Math.max(15, (height * (idx % 2 === 0 ? 0.9 : 0.6)))}%` : '20%',
                animationDelay: `${idx * 0.1}s`,
              }}
            />
          ))}
          <span className="font-mono text-2xs text-slate-500 ml-2 font-tabular">
            {isCurrentPlaying ? 'TRANSMITTING' : 'READY'}
          </span>
        </div>
      </div>
    </div>
  );
}
