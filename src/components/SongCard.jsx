import React from "react";

export default function SongCard({ track }) {
  const artwork = track.artworkUrl100?.replace("100x100","300x300");
  return (
    <div className="song card">
      <img src={artwork} alt={track.trackName}/>
      <div className="song-info">
        <div className="song-name">{track.trackName}</div>
        <div className="song-artist">{track.artistName}</div>
        <div style={{marginTop:6}}>
          {track.previewUrl ? (
            <audio controls src={track.previewUrl} style={{width:"100%"}}>
              Your browser does not support the audio element.
            </audio>
          ) : (
            <div className="small-muted">Preview not available</div>
          )}
        </div>
      </div>
    </div>
  );
}
