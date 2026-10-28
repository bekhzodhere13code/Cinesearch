"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import MovieCard from "./MovieCard";
import type { ListItem } from "@/lib/types";

export default function MovieRow({ title, items, href }: { title: string; items: ListItem[]; href?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const { isSignedIn } = useAuth();

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update, items.length]);

  if (!items.length) return null;

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="section">
      <div className="section-head">
        <h2>{title}</h2>
        {href && (
          <Link href={isSignedIn ? href : "/login"} className="see-all" prefetch={isSignedIn ? undefined : false}>
            See All <span aria-hidden>›</span>
          </Link>
        )}
      </div>
      <div className="row-wrap">
        {canLeft && <button className="row-arrow left" onClick={() => scroll(-1)} aria-label="Scroll left">‹</button>}
        <div className="row" ref={ref} onScroll={update}>
          {items.map((i) => <MovieCard key={i.id} item={i} />)}
        </div>
        {canRight && <button className="row-arrow right" onClick={() => scroll(1)} aria-label="Scroll right">›</button>}
      </div>
    </section>
  );
}
