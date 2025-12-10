import React from "react";
import { useNavigate } from "react-router-dom";

export default function ArtistCard({ artist }) {
  const nav = useNavigate();
  const artistId = artist.artistId;
  const img = artist.artworkUrl100?.replace("100x100", "300x300") || "";

  return (
    <div className="card" onClick={() => nav(`/artist/${artistId}`)} style={{cursor:"pointer"}}>
      <img className="artist-img" src={img} alt={artist.artistName} />
      <div className="artist-name">{artist.artistName}</div>
      <div className="artist-sub small-muted">{artist.primaryGenreName}</div>
    </div>
  );
}
