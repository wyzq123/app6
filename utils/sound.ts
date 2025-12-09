
/**
 * Simple Sound Synthesizer using Web Audio API
 * No external files required.
 */

let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

const playTone = (freq: number, type: OscillatorType, duration: number, startTime = 0, volume = 0.1) => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
  
  gain.gain.setValueAtTime(volume, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
};

export const SoundManager = {
  playClick: () => {
    playTone(800, 'sine', 0.1);
  },
  playDelete: () => {
    playTone(300, 'sawtooth', 0.1);
  },
  playMove: () => {
    playTone(200, 'triangle', 0.1);
    setTimeout(() => playTone(250, 'triangle', 0.1), 50);
  },
  playStart: () => {
    playTone(400, 'sine', 0.1);
    playTone(600, 'sine', 0.1, 0.1);
    playTone(800, 'sine', 0.2, 0.2);
  },
  playWin: () => {
    const ctx = getCtx();
    const now = 0;
    playTone(523.25, 'square', 0.1, now);       // C
    playTone(659.25, 'square', 0.1, now + 0.1); // E
    playTone(783.99, 'square', 0.1, now + 0.2); // G
    playTone(1046.50, 'square', 0.4, now + 0.3);// High C
  },
  playFail: () => {
    playTone(300, 'sawtooth', 0.3);
    playTone(200, 'sawtooth', 0.4, 0.2);
  },
  playStar: () => {
    // Magical chime sound
    playTone(1000, 'sine', 0.3, 0, 0.2);
    playTone(1500, 'sine', 0.3, 0.1, 0.2);
    playTone(2000, 'sine', 0.5, 0.2, 0.1);
  },
  playPortal: () => {
    // Whoosh sound using a sweep
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  },
  speak: (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any currently playing speech to avoid overlap
      window.speechSynthesis.cancel();
      
      // Remove emojis so they aren't read aloud (e.g. "Party Popper")
      const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'zh-CN'; 
      
      // "Happy" tone configuration:
      // Pitch > 1.0 sounds younger/happier. 1.6 was too much, 1.3 is usually the sweet spot for "cartoonish but clear".
      // Rate > 1.0 adds energy.
      utterance.rate = 1.1;     
      utterance.pitch = 1.3;    
      
      // Try to find a voice that might sound better
      const voices = window.speechSynthesis.getVoices();
      // Prefer Google's voice if available as it's usually higher quality
      const cnVoice = voices.find(v => v.lang === 'zh-CN' && v.name.includes('Google')) || voices.find(v => v.lang === 'zh-CN');
      if (cnVoice) {
        utterance.voice = cnVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  }
};
