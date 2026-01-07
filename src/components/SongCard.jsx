import React from "react";
import { usePlayer } from "../context/PlayerContext";

export default function SongCard({ track }) {
  const { play, currentTrack, isPlaying, favorites, toggleFavorite } = usePlayer();
  const artwork = track.artworkUrl100?.replace("100x100", "200x200");
  const isCurrent = currentTrack?.trackId === track.trackId;
  const isFavorite = favorites.some(f => f.trackId === track.trackId);

  const handlePlay = (e) => {
    // Prevent play if clicking like button
    if (e.target.closest('.like-btn')) return;
    play(track);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(track);
  };

  return (
    <div
      className={`song ${isCurrent ? "active" : ""}`}
      onClick={handlePlay}
      style={{
        borderLeft: isCurrent ? "4px solid var(--accent)" : "4px solid transparent",
        background: isCurrent ? "rgba(139, 92, 246, 0.1)" : ""
      }}
    >
      <div style={{ position: "relative", width: "48px", height: "48px" }}>
        <img src={artwork} alt={track.trackName} />
        <div className="song-play-overlay">
          {isCurrent && isPlaying ? "⏸" : "▶"}
        </div>
      </div>
      <div className="song-info">
        <div className="song-name" style={{ color: isCurrent ? "var(--accent)" : "white" }}>
          {track.trackName}
        </div>
        <div className="song-artist">{track.artistName}</div>
      </div>
      <div className="song-stats" style={{ color: "var(--text-muted)", fontSize: "12px", marginRight: "12px" }}>
        {track.primaryGenreName}
      </div>
      <button
        className={`like-btn ${isFavorite ? "active" : ""}`}
        onClick={handleFavorite}
        style={{ color: isFavorite ? "var(--accent)" : "var(--text-muted)" }}
      >
        {isFavorite ? "❤️" : "♡"}
      </button>

      <style>{`
        .song-play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          border-radius: 8px;
          color: white;
          font-size: 14px;
        }
        .song:hover .song-play-overlay {
          opacity: 1;
        }
        .like-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          padding: 8px;
          transition: transform 0.2s, color 0.2s;
        }
        .like-btn:hover {
          transform: scale(1.2);
        }
        .like-btn.active {
          animation: pop 0.3s ease-out;
        }
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
