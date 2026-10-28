import axios from "axios";
import { useTrailerStore } from "@/store/useTrailerStore";

// Requests go through our Next.js proxy (src/app/api/tmdb) so the token stays on the server.
export const tmdb = axios.create({ baseURL: "/api/tmdb" });

export const local = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DB_URL ?? "http://localhost:4000",
});

export const get = async <T>(path: string, params?: Record<string, unknown>) =>
  (await tmdb.get<T>(path, { params })).data;

export const img = (path?: string | null, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.svg";

export async function openTrailer(type: string, id: number) {
  const { setState } = useTrailerStore;
  setState({ open: true, loading: true, videoKey: null });
  try {
    const d = await get<{ results: { key: string; site: string; type: string }[] }>(`/${type}/${id}/videos`);
    const v =
      d.results.find((x) => x.site === "YouTube" && x.type === "Trailer") ??
      d.results.find((x) => x.site === "YouTube");
    // modal yopilib ketgan bo'lsa, qayta ochmaymiz
    if (useTrailerStore.getState().open) setState({ loading: false, videoKey: v?.key ?? null });
  } catch {
    if (useTrailerStore.getState().open) setState({ loading: false, videoKey: null });
  }
}
