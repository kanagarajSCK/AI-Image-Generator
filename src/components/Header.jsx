import React from "react";

export default function Header({ isDark, toggleTheme }) {
  return (
    <header className="header">
      <div className="logo-wrapper">
        <div className="logo">
          <i className="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <h1>AI Image Generator</h1>
      </div>
      <button
        className="theme-toggle"
        aria-label="Toggle theme"
        onClick={toggleTheme}
      >
        <i className={`fa-solid ${isDark ? "fa-sun" : "fa-moon"}`}></i>
      </button>
    </header>
  );
}
