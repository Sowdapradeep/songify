import React, { useEffect, useState } from "react";
import ArtistCard from "../components/ArtistCard";
import SkeletonLoader from "../components/SkeletonLoader";

const DEFAULT_ARTISTS = [
  "Coldplay", "Adele", "Ed Sheeran", "Bruno Mars", "The Weeknd",
  "Taylor Swift", "Drake", "Imagine Dragons", "Arijit Singh", "Shreya Ghoshal"
];

export default function Home() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function fetchArtists() {
      setLoading(true);
      try {
        const promises = DEFAULT_ARTISTS.map(name =>
          fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=musicTrack&limit=1`)
            .then(res => res.json())
        );
        const results = await Promise.all(promises);
        const list = results.map(r => r.results?.[0]).filter(Boolean);
        setArtists(list);
      } catch (e) {
        setErr("Failed to load artists");
      } finally {
        setLoading(false);
      }
    }
    fetchArtists();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700" }}>Trending Artists</h1>
      </div>

      {loading ? (
        <SkeletonLoader type="card" count={10} />
      ) : err ? (
        <div className="center">{err}</div>
      ) : (
        <div className="grid">
          {artists.map(a => (
            <ArtistCard key={a.artistId} artist={a} />
          ))}
        </div>
      )}
    </div>
  );
}
