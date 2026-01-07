import React from "react";
import { useNavigate } from "react-router-dom";

export default function ArtistCard({ artist }) {
  const nav = useNavigate();
  const artistId = artist.artistId;
  const name = artist.artistName || "Unknown Artist";

  // iTunes musicArtist objects don't usually have an artworkUrl100
  const artwork = artist.artworkUrl100
    ? artist.artworkUrl100.replace("100x100", "400x400")
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b5cf6&color=fff&size=512&font-size=0.35&bold=true`;

  return (
    <div className="card" onClick={() => nav(`/artist/${artistId}`)}>
      <img
        className="artist-img"
        src={artwork}
        alt={name}
        onError={(e) => {
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b5cf6&color=fff&size=512`;
        }}
      />
      <div className="artist-name">{name}</div>
      <div className="artist-sub">{artist.primaryGenreName || "Artist"}</div>
    </div>
  );
}
