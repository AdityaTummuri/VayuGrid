import React, { useState, useEffect } from 'react';
import { Volume2, Play, Square, Globe, Radio, AlertTriangle, ShieldAlert, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { LANGUAGE_META } from '../../constants/classifications';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { getCityBroadcastData } from '../../constants/cityBroadcasts';

export function VernacularAudioPlayer({ city, activeIncident, title = 'Statutory Public Health Audio Broadcast' }) {
  const cityData = getCityBroadcastData(city?.id);
  
  // Available broadcast scenarios for this city
  const scenarios = cityData.scenarios || [];
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const activeScenario = scenarios[selectedScenarioIndex] || scenarios[0];

  // Default to city's native language (e.g. 'kn' for Bengaluru, 'hi' for Delhi, 'pa' for Punjab)
  const [selectedLang, setSelectedLang] = useState(cityData.primaryLanguage || 'hi');
  const { isPlaying, activeLang, voiceNotice, play, stop } = useAudioPlayer();

  // Reset selected language to city's primary language when city changes
  useEffect(() => {
    setSelectedLang(cityData.primaryLanguage || 'hi');
    if (isPlaying) stop();
  }, [city?.id, cityData.primaryLanguage]);

  // Current text to be broadcast in chosen language
  const currentText =
    activeScenario?.texts?.[selectedLang] ||
    activeScenario?.texts?.en ||
    activeIncident?.vernacular_advisories?.[selectedLang] ||
    activeIncident?.vernacular_advisories?.en ||
    'Statutory Health Directive: High particulate loading detected. Please remain indoors with air filtration active.';

  // Fallback English text if regional voice pack is missing on the client OS
  const fallbackEnglishText = activeScenario?.texts?.en || activeIncident?.vernacular_advisories?.en || currentText;

  const handleTogglePlayback = () => {
    if (isPlaying && activeLang === selectedLang) {
      stop();
    } else {
      play(currentText, selectedLang, fallbackEnglishText);
    }
  };

  const isCurrentPlaying = isPlaying && activeLang === selectedLang;

  // Filter or prioritize languages supported in this city
  const languages = LANGUAGE_META.filter(l => 
    cityData.supportedLanguages ? cityData.supportedLanguages.includes(l.code) || l.code === 'en' : true
  );

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
      {/* Broadcast Header & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs">
            <Radio className={`h-4 w-4 ${isCurrentPlaying ? 'animate-pulse text-red-600' : 'text-blue-600'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-sans">
                {title}
              </span>
              <span className="text-3xs font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                {city?.name?.toUpperCase() || 'LOCAL'} MUNICIPAL FREQUENCY
              </span>
            </div>
            <p className="text-2xs text-slate-500 font-sans mt-0.5">
              CPCB statutory multi-dialect citizen warning system • Regional landmarks matched
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-3xs font-mono font-bold border ${
            isCurrentPlaying
              ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isCurrentPlaying ? 'bg-red-600' : 'bg-emerald-600'}`} />
            {isCurrentPlaying ? 'AUDIO TRANSMITTING LIVE' : 'SYNTHESIZER STANDBY'}
          </span>
        </div>
      </div>

      {/* Broadcast Scenario Switcher (Situational Awareness) */}
      <div>
        <div className="text-2xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
          <span>Active Broadcast Scenario:</span>
          <span className="text-slate-400 font-normal">3 Real-Time Directives Available</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {scenarios.map((sc, idx) => {
            const isSelected = selectedScenarioIndex === idx;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setSelectedScenarioIndex(idx);
                  if (isPlaying) stop();
                }}
                className={`p-2.5 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 shadow-2xs ring-1 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-3xs font-bold text-slate-500">
                    DISPATCH #{idx + 1}
                  </span>
                  <span className={`text-3xs font-bold font-mono px-1 rounded ${
                    sc.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {sc.severity}
                  </span>
                </div>
                <div className={`text-xs font-bold leading-snug line-clamp-1 ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                  {sc.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Matched City Hotspots Ribbon */}
      {cityData.hotspots && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-2xs font-mono text-slate-600">
          <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <span className="font-bold text-slate-800">Monitored Landmarks:</span>
          <span className="truncate">{cityData.hotspots.join(' • ')}</span>
        </div>
      )}

      {/* Language Selection Tabs */}
      <div>
        <div className="text-2xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
          <span>Target Citizen Dialect ({languages.length} Available):</span>
          <span className="text-blue-700 font-bold">PRIMARY: {cityData.primaryLanguage.toUpperCase()}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {languages.map((lang) => {
            const isSelected = selectedLang === lang.code;
            const isPrimary = lang.code === cityData.primaryLanguage;

            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setSelectedLang(lang.code);
                  if (isPlaying) stop();
                }}
                className={`px-3 py-1.5 rounded-lg text-left transition-all border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-2xs font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span className="text-xs">{lang.nativeName}</span>
                <span className={`text-3xs font-mono px-1 py-0.2 rounded uppercase ${
                  isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {lang.code}
                  {isPrimary && ' ★'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advisory Text Display Card */}
      <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs sm:text-sm text-slate-900 leading-relaxed font-sans min-h-[5rem] shadow-inner relative">
        <p className="font-medium">{currentText}</p>
        
        {voiceNotice && (
          <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-3xs font-mono text-amber-800 flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3 text-amber-600 shrink-0" />
            <span>{voiceNotice}</span>
          </div>
        )}
      </div>

      {/* Audio Playback Controls & Waveform Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <button
          type="button"
          onClick={handleTogglePlayback}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg font-mono text-xs font-bold transition-all shadow-sm ${
            isCurrentPlaying
              ? 'bg-red-600 hover:bg-red-700 border border-red-700 text-white shadow-red-200'
              : 'bg-blue-600 hover:bg-blue-700 border border-blue-700 text-white shadow-blue-200'
          }`}
        >
          {isCurrentPlaying ? (
            <>
              <Square className="h-3.5 w-3.5 fill-current" />
              <span>HALT EMERGENCY BROADCAST</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>BROADCAST IN {selectedLang.toUpperCase()} (CHIME + VOICE)</span>
            </>
          )}
        </button>

        {/* Studio Waveform Indicator */}
        <div className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-slate-100 border border-slate-200">
          {[30, 65, 45, 90, 55, 80, 40, 95, 60, 45, 75, 50, 85, 40].map((height, idx) => (
            <div
              key={idx}
              className={`w-0.75 rounded-full transition-all duration-150 ${
                isCurrentPlaying
                  ? 'bg-blue-600 animate-pulse'
                  : 'bg-slate-300'
              }`}
              style={{
                height: isCurrentPlaying ? `${Math.max(20, (height * (idx % 2 === 0 ? 0.9 : 0.6)))}%` : '20%',
                animationDelay: `${idx * 0.08}s`,
              }}
            />
          ))}
          <span className="font-mono text-3xs font-bold text-slate-600 ml-2 font-tabular">
            {isCurrentPlaying ? 'AUDIO TRANSMITTING' : 'TTS READY'}
          </span>
        </div>
      </div>
    </div>
  );
}
