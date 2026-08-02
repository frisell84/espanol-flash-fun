import { useCallback, useEffect, useState } from "react";

/** Uttal via webbläsarens inbyggda röstsyntes (ingen server behövs). */
export function useSpeech() {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);
    // Vissa webbläsare laddar röster asynkront.
    window.speechSynthesis.getVoices();
    const onVoices = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", onVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
  }, []);

  const speak = useCallback((text: string, lang: "es-ES" | "sv-SE" = "es-ES") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.9;
    const prefix = lang.slice(0, 2);
    const voice =
      synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(prefix)) ?? null;
    if (voice) utter.voice = voice;
    synth.speak(utter);
  }, []);

  return { supported, speak };
}
