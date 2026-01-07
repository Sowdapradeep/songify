import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SongCard from "../components/SongCard";
import SkeletonLoader from "../components/SkeletonLoader";

export default function ArtistDetails() {
  const { id } = useParams();
  const [tracks, setTracks] = useState([]);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetchArtistTracks() {
      setLoading(true);
      setErr(null);
      try {
        const url = `https://itunes.apple.com/lookup?id=${encodeURIComponent(id)}&entity=song&limit=50`;
        const res = await fetch(url);
        const json = await res.json();
        if (!json.results || json.results.length === 0) {
          setErr("No data found for this artist.");
          setTracks([]);
          return;
        }
        setArtist(json.results[0]);
        const songs = json.results.slice(1).filter(r => r.wrapperType === "track");
        setTracks(songs);
      } catch (e) {
        setErr("Failed to fetch artist details.");
      } finally {
        setLoading(false);
      }
    }
    fetchArtistTracks();
  }, [id]);

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <Link to="/" style={{ color: "var(--accent)", textDecoration: "none", fontSize: "14px" }}>← Back</Link>
      </div>

      {loading ? (
        <div style={{ display: "flex", gap: "24px", alignItems: "center", marginBottom: "40px" }}>
          <div style={{ width: "200px", height: "200px", borderRadius: "12px", background: "rgba(255,255,255,0.05)" }} />
          <div>
            <div style={{ width: "250px", height: "40px", borderRadius: "8px", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ width: "150px", height: "20px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", marginTop: "12px" }} />
          </div>
        </div>
      ) : artist && (
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-end", marginBottom: "40px" }}>
          <img
            src={
              artist.artworkUrl100?.replace("100x100", "500x500") ||
              tracks[0]?.artworkUrl100?.replace("100x100", "500x500") ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.artistName)}&background=8b5cf6&color=fff&size=512&bold=true`
            }
            alt={artist.artistName}
            style={{ width: "200px", height: "200px", borderRadius: "16px", objectFit: "cover", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.artistName)}&background=8b5cf6&color=fff&size=512`;
            }}
          />
          <div style={{ paddingBottom: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "var(--accent)" }}>Artist</span>
            <h1 style={{ fontSize: "64px", fontWeight: "800", margin: "4px 0" }}>{artist.artistName}</h1>
            <div style={{ color: "var(--text-muted)" }}>{artist.primaryGenreName} • {tracks.length} Popular Tracks</div>
          </div>
        </div>
      )}

      {err && <div className="center">{err}</div>}

      <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "24px" }}>
        <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>Tracks</h2>
        {loading ? (
          <SkeletonLoader type="list" count={10} />
        ) : tracks.length > 0 ? (
          <div className="song-list">
            {tracks.map(track => <SongCard key={track.trackId} track={track} />)}
          </div>
        ) : !loading && !err && (
          <div className="center">No songs found.</div>
        )}
      </div>
    </div>
  );
}
