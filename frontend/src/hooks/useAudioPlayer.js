import { useState, useEffect, useCallback, useRef } from 'react';

const BCP47_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
  pa: 'pa-IN',
  mr: 'mr-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  ml: 'ml-IN',
  gu: 'gu-IN',
};

/**
 * Synthesizes an authentic 2-tone official emergency broadcast chime
 * using the Web Audio API without needing external MP3 files.
 */
function playEmergencyChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // Tone 1: 520 Hz (C5) for 150ms
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.15);

    // Tone 2: 784 Hz (G5) for 250ms
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.16);
    osc2.stop(ctx.currentTime + 0.45);
  } catch (e) {
    // AudioContext autoplay restriction or unsupported
  }
}

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLang, setActiveLang] = useState('en');
  const [voiceNotice, setVoiceNotice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const utteranceRef = useRef(null);

  // Cache available speech synthesis voices as soon as they load
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const list = window.speechSynthesis.getVoices();
      if (list && list.length > 0) {
        setAvailableVoices(list);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setVoiceNotice(null);
  }, []);

  const play = useCallback((text, langCode = 'en', fallbackEnglishText = '') => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    if (!text) return;

    // Play GovTech emergency chime first
    playEmergencyChime();

    setActiveLang(langCode);
    const bcp47 = BCP47_MAP[langCode] || 'en-IN';
    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();

    // Check if browser has a voice for this specific language
    const matchingVoice = voices.find(
      v => v.lang.toLowerCase() === bcp47.toLowerCase() ||
           v.lang.toLowerCase().replace('_', '-').startsWith(langCode.toLowerCase())
    );

    // Determine speech text and voice
    let spokenText = text;
    let selectedVoice = matchingVoice;
    let spokenLang = bcp47;

    // If requesting a regional script (e.g. Kannada, Punjabi, Telugu) but the OS lacks a regional TTS voice pack,
    // prevent garbled phonetic noise by falling back to clear Indian English voice with notice
    const isNonEnglish = langCode !== 'en';
    if (isNonEnglish && !matchingVoice) {
      // Find Indian English or standard English voice
      const indianEnglishVoice = voices.find(v => v.lang === 'en-IN' || v.lang.includes('en-IN')) ||
                                 voices.find(v => v.lang.startsWith('en'));
      selectedVoice = indianEnglishVoice;
      spokenLang = 'en-IN';
      spokenText = fallbackEnglishText || text;
      setVoiceNotice(`Using Indian English voice (${langCode.toUpperCase()} speech pack not installed on this OS)`);
    } else {
      setVoiceNotice(null);
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = spokenLang;
    utterance.rate = 0.88; // Calm, clear statutory public broadcast tempo
    utterance.pitch = 1.0;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setVoiceNotice(null);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsPlaying(false);
      setVoiceNotice(null);
    };

    utteranceRef.current = utterance;

    // Wait 250ms for the emergency chime to ring before speaking
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 280);
  }, [availableVoices]);

  return {
    isPlaying,
    activeLang,
    voiceNotice,
    play,
    stop,
  };
}
