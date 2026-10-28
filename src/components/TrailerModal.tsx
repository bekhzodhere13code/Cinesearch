"use client";
import { useEffect } from "react";
import { useTrailerStore } from "@/store/useTrailerStore";

export default function TrailerModal() {
  const { open, loading, videoKey, close } = useTrailerStore();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Trailer" onClick={close}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close} aria-label="Close trailer">✕</button>
        <div className="video">
          {loading ? (
            <p className="muted">Loading trailer...</p>
          ) : videoKey ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
              title="Trailer"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <p className="muted">Trailer topilmadi.</p>
          )}
        </div>
      </div>
    </div>
  );
}
