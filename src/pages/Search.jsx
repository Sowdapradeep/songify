import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ArtistCard from "../components/ArtistCard";
import SongCard from "../components/SongCard";

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

        // search artists (separate call)
        const artistRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=musicArtist&limit=10`);
        const artistJson = await artistRes.json();
        setArtists(artistJson.results || []);
      } catch (e) {
        setErr("Failed to fetch search results");
      } finally {
        setLoading(false);
      }
    }
    doSearch();
  }, [q]);

  if (!q) {
    return <div className="center">Use the search bar to find songs or artists.</div>;
  }

  return (
    <div>
      <h2 style={{marginBottom:12}}>Search results for “{q}”</h2>
      {loading && <div className="center">Searching...</div>}
      {err && <div className="center">{err}</div>}

      <h3 style={{marginTop:8}}>Artists</h3>
      <div className="grid" style={{marginTop:8}}>
        {artists.length ? artists.map(a => <ArtistCard key={a.artistId} artist={a} />)
         : <div className="center">No artists found.</div>}
      </div>

      <h3 style={{marginTop:18}}>Tracks</h3>
      <div style={{marginTop:12}}>
        {tracks.length ? tracks.map(t => <SongCard key={t.trackId} track={t} />)
         : <div className="center">No tracks found for this search.</div>}
      </div>

      <div style={{marginTop:18}}>
        <Link to="/" style={{color:"#9fb1b6"}}>← Back to Home</Link>
      </div>
    </div>
  );
}
