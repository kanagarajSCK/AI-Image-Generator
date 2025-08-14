import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import Header from "./components/Header";
import PromptForm from "./components/PromptForm";
import GalleryGrid from "./components/GalleryGrid";

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [cards, setCards] = useState([]);        // [{id, status: 'loading'|'done'|'error', url}]
  const [currentRatio, setCurrentRatio] = useState("1/1");
  const genIdRef = useRef(0);                    // guard against stale loads

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setIsDark(true);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  useEffect(() => {
    document.body.classList.toggle("dark-theme", isDark);
  }, [isDark]);

  const getImageDimensions = (aspectRatio, baseSize = 1024) => {
    const [w, h] = aspectRatio.split("/").map(Number);
    const scaleFactor = baseSize / Math.sqrt(w * h);
    let calculatedWidth = Math.floor((w * scaleFactor) / 16) * 16;
    let calculatedHeight = Math.floor((h * scaleFactor) / 16) * 16;
    calculatedWidth = Math.max(320, Math.min(calculatedWidth, 1536));
    calculatedHeight = Math.max(320, Math.min(calculatedHeight, 1536));
    return { width: calculatedWidth, height: calculatedHeight };
  };

  const modelStyleMap = {
    "black-forest-labs/FLUX.1-dev":
      "ultra detailed, photorealistic, cinematic lighting, high dynamic range",
    "black-forest-labs/FLUX.1-schnell":
      "clean line art, concept art, minimal noise, fast sketch style",
    "stabilityai/stable-diffusion-xl-base-1.0":
      "sdxl style, hyper-detailed, sharp focus, realistic textures",
    "runwayml/stable-diffusion-v1-5":
      "digital art, trending on artstation, vivid colors, detailed illustration",
    "prompthero/openjourney":
      "openjourney style, anime aesthetics, studio ghibli inspired, soft shading",
  };

  // Generate images with fixed slots; each slot updates in place on load
  const onGenerate = ({ prompt, model, count, ratio }) => {
    const thisGen = ++genIdRef.current;
    setCurrentRatio(ratio);

    // initialize fixed slots
    const initial = Array.from({ length: count }, (_, i) => ({
      id: `${thisGen}-${i}`,
      status: "loading",
      url: null,
    }));
    setCards(initial);

    const { width, height } = getImageDimensions(ratio);
    const style = modelStyleMap[model] || "";
    const finalPrompt = style ? `${prompt}, ${style}` : prompt;

    for (let i = 0; i < count; i++) {
      const seed = Date.now() + i + Math.floor(Math.random() * 1e6);
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        finalPrompt
      )}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        if (genIdRef.current !== thisGen) return; // ignore stale
        setCards((prev) => {
          if (!prev[i] || prev[i].id !== `${thisGen}-${i}`) return prev;
          const next = [...prev];
          next[i] = { ...next[i], status: "done", url };
          return next;
        });
      };

      img.onerror = () => {
        if (genIdRef.current !== thisGen) return;
        setCards((prev) => {
          if (!prev[i] || prev[i].id !== `${thisGen}-${i}`) return prev;
          const next = [...prev];
          next[i] = { ...next[i], status: "error", url: null };
          return next;
        });
      };

      img.src = url;
    }
  };

  return (
    <div className="container">
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <div className="main-content">
        <PromptForm onGenerate={onGenerate} />
        <GalleryGrid cards={cards} ratio={currentRatio} />
      </div>
    </div>
  );
}
