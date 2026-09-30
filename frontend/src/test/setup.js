import '@testing-library/jest-dom';

// Mock Web Speech API for JSDOM
if (typeof window !== 'undefined') {
  window.speechSynthesis = {
    speak: () => {},
    cancel: () => {},
    pause: () => {},
    resume: () => {},
    getVoices: () => [
      { name: 'Google हिन्दी', lang: 'hi-IN' },
      { name: 'Google Indian English', lang: 'en-IN' },
      { name: 'Google ಕನ್ನಡ', lang: 'kn-IN' },
    ],
    onvoiceschanged: null,
  };

  window.SpeechSynthesisUtterance = function (text) {
    this.text = text;
    this.lang = 'en-IN';
    this.rate = 1.0;
    this.pitch = 1.0;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
  };
}
