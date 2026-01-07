import React from "react";

export default function SkeletonLoader({ type = "card", count = 1 }) {
    const CardSkeleton = () => (
        <div className="card skeleton">
            <div className="skeleton-img" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }} />
            <div className="skeleton-text" style={{ marginTop: '16px', height: '18px', width: '70%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
            <div className="skeleton-text" style={{ marginTop: '8px', height: '14px', width: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
        </div>
    );

    const RowSkeleton = () => (
        <div className="song skeleton" style={{ background: 'transparent' }}>
            <div className="skeleton-img" style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }} />
            <div className="song-info">
                <div className="skeleton-text" style={{ height: '16px', width: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                <div className="skeleton-text" style={{ marginTop: '6px', height: '12px', width: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
            </div>
        </div>
    );

    return (
        <div className={type === "card" ? "grid" : "song-list"}>
            {Array.from({ length: count }).map((_, i) => (
                type === "card" ? <CardSkeleton key={i} /> : <RowSkeleton key={i} />
            ))}
            <style>{`
        .skeleton {
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
        </div>
    );
}
