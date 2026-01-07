import React from "react";
import { usePlayer } from "../context/PlayerContext";

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    toggle,
    next,
    prev,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    loading
  } = usePlayer();

  if (!currentTrack) {
    return (
      <div className="playerbar empty">
        <div className="player-inner">
          <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Select a track to start listening
          </div>
        </div>
      </div>
    );
  }

  const title = currentTrack.trackName || currentTrack.title || currentTrack.name;
  const artist = currentTrack.artistName || currentTrack.artist || currentTrack.subtitle;
  const img = currentTrack.artworkUrl100 || currentTrack.image;

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    seek(parseFloat(e.target.value));
  };

  return (
    <div className="playerbar">
      <div className="player-inner">
        <div className="player-left">
          <img src={img} alt={title} className="player-cover" />
          <div style={{ overflow: "hidden" }}>
            <div className="player-title">{title}</div>
            <div className="player-artist">{Array.isArray(artist) ? artist.join(", ") : artist}</div>
          </div>
          {loading && <div className="loader-small" style={{ marginLeft: "12px" }}>🌀</div>}
        </div>

        <div className="player-center">
          <div className="controls">
            <button onClick={prev} className="control-btn">⏮</button>
            <button onClick={toggle} className="control-btn play-pause">
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button onClick={next} className="control-btn">⏭</button>
          </div>

          <div className="progress-container">
            <span className="time">{formatTime(currentTime)}</span>
            <input
              type="range"
              className="progress"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              style={{
                background: `linear-gradient(to right, var(--accent) ${(currentTime / duration) * 100 || 0}%, rgba(255,255,255,0.1) ${(currentTime / duration) * 100 || 0}%)`
              }}
            />
            <span className="time">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-right">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "120px" }}>
            <span style={{ fontSize: "14px" }}>🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
              style={{
                width: "100%",
                height: "4px",
                accentColor: "var(--accent)"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
