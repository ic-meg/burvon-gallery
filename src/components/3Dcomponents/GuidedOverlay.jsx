import React, { useEffect, useState } from 'react';

export default function GuidedOverlay({ visible = false, autoHideMs = 4500, onDismiss }) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    setShow(visible);
    let t;
    if (visible && autoHideMs > 0) {
      t = setTimeout(() => setShow(false), autoHideMs);
    }
    return () => clearTimeout(t);
  }, [visible, autoHideMs]);

  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-40 ">
      <div className="pointer-events-auto bg-black/65 backdrop-blur-sm text-white rounded-xl px-4 py-3 flex items-center gap-4 shadow-lg max-w-sm mx-4">
        <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
          {/* simple hand / gesture svg */}
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 7V4a1 1 0 012 0v3" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 6V3a1 1 0 012 0v3" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 7V2a1 1 0 012 0v5" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 13c0-1.5 1-3 3-3h.5a2 2 0 012 2v5" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 18v1a2 2 0 002 2h2" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="flex-1">
          <div className="font-semibold avantbold">Try the 3D viewer</div>
          <div className="text-sm text-[#EAE6D8]/90">Drag to rotate • Pinch or scroll to zoom</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShow(false); if (onDismiss) onDismiss(); }}
            className="bg-[#FFF7DC] text-[#1f1f21] px-3 py-1 rounded-full text-sm avantbold shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
