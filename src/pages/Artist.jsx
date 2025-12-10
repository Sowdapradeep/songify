import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import SongCard from "../components/SongCard";

export default function Artist() {
  const { artistName } = useParams();
  const [songs, setSongs] = useState([]);
  const currentAudio = useRef(null);

  useEffect(() => {
    fetch(`https://itunes.apple.com/search?term=${artistName}&media=music`)
      .then((res) => res.json())
      .then((data) => setSongs(data.results));
  }, [artistName]);

  const handlePlay = (newAudio) => {
    if (currentAudio.current && currentAudio.current !== newAudio.current) {
      currentAudio.current.pause();
      currentAudio.current.currentTime = 0;
    }
    currentAudio.current = newAudio.current;
  };

  return (
    <div className="page">
      <h2>🎤 {artistName}</h2>
      <div className="song-grid">
        {songs.map((song) => (
          <SongCard key={song.trackId} song={song} onPlay={handlePlay} />
        ))}
      </div>
    </div>
  );
}
