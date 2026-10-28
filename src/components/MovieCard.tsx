"use client";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { img } from "@/lib/api";
import type { ListItem } from "@/lib/types";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { useListStore } from "@/store/useListStore";

export default function MovieCard({ item }: { item: ListItem }) {
  const isFav = useListStore((s) => s.favorites.some((i) => i.id === item.id));
  const toggle = useListStore((s) => s.toggle);
  const person = item.type === "person";
  const guard = useAuthGuard();
  const { isSignedIn } = useAuth();

  const body = (
    <>
      <div className="poster">
        <img src={img(item.poster_path)} alt={item.title} loading="lazy" />
        <span className="tag">{item.type === "tv" ? "TV" : item.type === "movie" ? "MOVIE" : "PERSON"}</span>
        {!person && (
          <button
            className={`heart ${isFav ? "on" : ""}`}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            onClick={(e) => {
              e.preventDefault();
              guard(() => toggle("favorites", item))();
            }}
          >
            ♥
          </button>
        )}
      </div>
      <h4>{item.title}</h4>
      <p className="meta">
        <span>{item.year}</span>
        {item.vote_average > 0 && (
          <span className="star">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" /></svg>
            {item.vote_average.toFixed(1)}
          </span>
        )}
      </p>
    </>
  );

  return person ? (
    <div className="card">{body}</div>
  ) : (
    <Link href={isSignedIn ? `/${item.type}/${item.tmdbId}` : "/login"} className="card" prefetch={isSignedIn ? undefined : false}>{body}</Link>
  );
}
