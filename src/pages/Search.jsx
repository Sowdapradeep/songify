import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ArtistCard from "../components/ArtistCard";
import SongCard from "../components/SongCard";
import SkeletonLoader from "../components/SkeletonLoader";

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!q) return;
    async function doSearch() {
      setLoading(true); setErr(null);
      try {
        // search tracks
        const trackRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=musicTrack&limit=25`);
        const trackJson = await trackRes.json();
        setTracks(trackJson.results || []);

        // search artists (using musicTrack to get artwork)
        const artistRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=musicTrack&limit=20`);
        const artistJson = await artistRes.json();
        // Deduplicate by artistId to show unique artists with their first found track artwork
        const uniqueArtists = [];
        const artistIds = new Set();
        (artistJson.results || []).forEach(item => {
          if (!artistIds.has(item.artistId)) {
            artistIds.add(item.artistId);
            uniqueArtists.push(item);
          }
        });
        setArtists(uniqueArtists.slice(0, 10));
      } catch (e) {
        setErr("Failed to fetch search results");
      } finally {
        setLoading(false);
      }
    }
    doSearch();
  }, [q]);

  if (!q) {
    return (
      <div className="center">
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <h2>Search for your favorite music</h2>
          <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>Artists, songs, and more...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: "24px", fontSize: "28px" }}>Results for “{q}”</h1>

      {err && <div className="center">{err}</div>}

      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "20px", color: "var(--text-muted)" }}>Artists</h2>
        {loading ? (
          <SkeletonLoader type="card" count={5} />
        ) : artists.length ? (
          <div className="grid">
            {artists.map(a => <ArtistCard key={a.artistId} artist={a} />)}
          </div>
        ) : (
          <div style={{ color: "var(--text-muted)" }}>No artists found.</div>
        )}
      </section>

      <section>
        <h2 style={{ marginBottom: "16px", fontSize: "20px", color: "var(--text-muted)" }}>Songs</h2>
        {loading ? (
          <SkeletonLoader type="list" count={8} />
        ) : tracks.length ? (
          <div className="song-list">
            {tracks.map(t => <SongCard key={t.trackId} track={t} />)}
          </div>
        ) : (
          <div style={{ color: "var(--text-muted)" }}>No tracks found.</div>
        )}
      </section>

      <div style={{ marginTop: "40px" }}>
        <Link to="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: "500" }}>← Back to Home</Link>
      </div>
    </div>
  );
}
