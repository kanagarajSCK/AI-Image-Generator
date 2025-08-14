import React from "react";

export default function GalleryGrid({ cards, ratio = "1/1" }) {
  return (
    <div className="gallery-grid">
      {cards.map((card, idx) => {
        if (card.status === "loading") {
          return (
            <div
              className="img-card loading"
              key={card.id}
              style={{ aspectRatio: ratio }}
            >
              <div className="status-container">
                <div className="spinner"></div>
                <i className="fa-solid fa-triangle-exclamation"></i>
                <p className="status-text">Generating...</p>
              </div>
            </div>
          );
        }

        if (card.status === "error") {
          return (
            <div
              className="img-card error"
              key={card.id}
              style={{ aspectRatio: ratio }}
            >
              <div className="status-container">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <p className="status-text">Failed to generate</p>
              </div>
            </div>
          );
        }

        return (
          <div className="img-card" key={card.id} style={{ aspectRatio: ratio }}>
            <img src={card.url} className="result-img" alt={`Generated ${idx + 1}`} />
            <div className="img-overlay">
              <button
                className="img-download-btn"
                title="Download"
                onClick={async () => {
                  try {
                    const res = await fetch(card.url, { mode: "cors" });
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const blob = await res.blob();
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = `image-${Date.now()}.png`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  } catch {
                    alert("Image download failed.");
                  }
                }}
              >
                <i className="fa-solid fa-download"></i>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
