import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SongCard from "../components/SongCard";

export default function ArtistDetails() {
  const { id } = useParams();
  const [tracks, setTracks] = useState([]);
  const [artistName, setArtistName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetchArtistTracks() {
      setLoading(true);
      setErr(null);
      try {
        // lookup returns artist info + songs when entity=song
        const url = `https://itunes.apple.com/lookup?id=${encodeURIComponent(id)}&entity=song&limit=50`;
        const res = await fetch(url);
        const json = await res.json();
        if (!json.results || json.results.length === 0) {
          setErr("No data found for this artist.");
          setTracks([]);
          return;
        }
        // first result is the artist info
        const artistInfo = json.results[0];
        setArtistName(artistInfo.artistName || "");
        // the rest are songs (skip first)
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
      <h2 style={{marginBottom:8}}>{artistName || "Artist"}</h2>
      {loading && <div className="center">Loading songs...</div>}
      {err && <div className="center">{err}</div>}
      {tracks.length === 0 && !loading && !err && <div className="center">No songs found.</div>}

      <div className="song-list" style={{marginTop:16}}>
        {tracks.map(track => <SongCard key={track.trackId} track={track} />)}
      </div>
    </div>
  );
}
