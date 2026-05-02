type SoundName = "action" | "success" | "failure";

const frequencies: Record<SoundName, [number, number]> = {
  action: [440, 660],
  success: [523, 784],
  failure: [220, 165],
};

export const playSound = (name: SoundName) => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  const context = new AudioContextClass();
  const gain = context.createGain();
  gain.gain.value = 0.035;
  gain.connect(context.destination);

  frequencies[name].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    oscillator.start(context.currentTime + index * 0.07);
    oscillator.stop(context.currentTime + index * 0.07 + 0.08);
  });

  window.setTimeout(() => void context.close(), 350);
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
