import React from "react";
import { usePlayer } from "../context/PlayerContext";
import SongCard from "../components/SongCard";

export default function Favorites() {
    const { favorites } = usePlayer();

    return (
        <div>
            <div style={{ marginBottom: "40px" }}>
                <h1 style={{ fontSize: "48px", fontWeight: "800", marginBottom: "8px" }}>My Favorites</h1>
                <p style={{ color: "var(--text-muted)" }}>{favorites.length} songs saved</p>
            </div>

            <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "24px" }}>
                {favorites.length > 0 ? (
                    <div className="song-list">
                        {favorites.map(track => (
                            <SongCard key={track.trackId} track={track} />
                        ))}
                    </div>
                ) : (
                    <div className="center">
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "48px", marginBottom: "16px" }}>❤️</div>
                            <h3>Your favorites list is empty</h3>
                            <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>Try liking some songs to see them here!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
