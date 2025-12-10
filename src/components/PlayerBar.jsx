import React, { useEffect, useState } from "react";
import { usePlayer } from "../context/PlayerContext";

export default function PlayerBar() {
  const { currentTrack, isPlaying, toggle, next, prev, audioRef } = usePlayer();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    function onTime() {
      if (!audio.duration || isNaN(audio.duration)) {
        setProgress(0);
        return;
      }
      setProgress((audio.currentTime / audio.duration) * 100);
    }
    audio.addEventListener("timeupdate", onTime);
    return () => audio.removeEventListener("timeupdate", onTime);
  }, [audioRef, currentTrack]);

  if (!currentTrack) {
    return (
      <div className="playerbar empty">
        <div className="player-inner">No song playing — select a track to start listening</div>
      </div>
    );
  }

  const title = currentTrack.title || currentTrack.name || currentTrack.trackName;
  const artist = currentTrack.subtitle || currentTrack.artist || currentTrack.artistName;
  const img = currentTrack.image || currentTrack.artworkUrl100;

  return (
    <div className="playerbar">
      <div className="player-inner">
        <div className="player-left">
          <img src={img} alt={title} className="player-cover" />
          <div>
            <div className="player-title">{title}</div>
            <div className="player-artist">{Array.isArray(artist) ? artist.join(", ") : artist}</div>
          </div>
        </div>

        <div className="player-center">
          <div className="controls">
            <button onClick={prev} className="control-btn">⏮</button>
            <button onClick={toggle} className="control-btn">{isPlaying ? "⏸" : "▶"}</button>
            <button onClick={next} className="control-btn">⏭</button>
          </div>

          <div className="progress" title="Playback progress">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="player-right">
          {/* future: volume, queue button */}
        </div>
      </div>
    </div>
  );
}
