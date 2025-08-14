import React, { useState } from "react";

export default function PromptForm({ onGenerate }) {
  const examplePrompts = [
    "A magic forest with glowing plants and fairy homes among giant mushrooms",
    "An old steampunk airship floating through golden clouds at sunset",
    "A future Mars colony with glass domes and gardens against red mountains",
    "A dragon sleeping on gold coins in a crystal cave",
    "An underwater kingdom with merpeople and glowing coral buildings"
  ];

  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("");
  const [count, setCount] = useState("");
  const [ratio, setRatio] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt && model && count && ratio) {
      onGenerate({ prompt, model, count: parseInt(count), ratio });
    }
  };

  return (
    <form className="prompt-form" onSubmit={handleSubmit}>
      <div className="prompt-container">
        <textarea
          className="prompt-input"
          placeholder="Describe your imagination in detail..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        ></textarea>
        <button
          type="button"
          className="prompt-btn"
          onClick={() =>
            setPrompt(examplePrompts[Math.floor(Math.random() * examplePrompts.length)])
          }
        >
          <i className="fa-solid fa-dice"></i>
        </button>
      </div>

      <div className="prompt-actions">
        <div className="select-wrapper">
          <select
            className="custom-select"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          >
            <option value="" disabled>Select Model</option>
            <option value="black-forest-labs/FLUX.1-dev">flux.1-dev</option>
            <option value="black-forest-labs/FLUX.1-schnell">flux.1-schnell</option>
            <option value="stabilityai/stable-diffusion-xl-base-1.0">Stable Diffusion XL</option>
            <option value="runwayml/stable-diffusion-v1-5">Stable Diffusion v1.5</option>
            <option value="prompthero/openjourney">openjourney</option>
          </select>
        </div>

        <div className="select-wrapper">
          <select
            className="custom-select"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            required
          >
            <option value="" disabled>Image Count</option>
            <option value="1">1 image</option>
            <option value="2">2 images</option>
            <option value="3">3 images</option>
            <option value="4">4 images</option>
          </select>
        </div>

        <div className="select-wrapper">
          <select
            className="custom-select"
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
            required
          >
            <option value="" disabled>Aspect Ratio</option>
            <option value="1/1">Square (1:1)</option>
            <option value="16/9">Landscape (16:9)</option>
            <option value="9/16">Portrait (9:16)</option>
          </select>
        </div>

        <button type="submit" className="generate-btn">
          <i className="fa-solid fa-wand-sparkles"></i> Generate
        </button>
      </div>
    </form>
  );
}
