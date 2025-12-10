import React, { useEffect, useState } from "react";
import ArtistCard from "../components/ArtistCard";

/**
 * iTunes doesn't have a "trending" endpoint; we'll use a curated list
 * of popular artist names to fetch their artist objects (you can change this list).
 */
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
        // Query multiple artists and collect unique artist objects
        const promises = DEFAULT_ARTISTS.map(name =>
          fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=musicArtist&limit=1`)
            .then(res => res.json())
        );
        const results = await Promise.all(promises);
        const list = results.flatMap(r => r.results || []);
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
      <h2 style={{marginBottom:12}}>Trending / Featured Artists</h2>

      {loading && <div className="center">Loading artists...</div>}
      {err && <div className="center">{err}</div>}

      <div className="grid" style={{marginTop:12}}>
        {artists.map(a => (
          <ArtistCard key={a.artistId} artist={a} />
        ))}
      </div>
    </div>
  );
}
