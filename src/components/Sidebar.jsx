import React, { useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const location = useLocation();

  function onSubmit(e) {
    e.preventDefault();
    if (q.trim() === "") return;
    nav(`/search?q=${encodeURIComponent(q.trim())}`);
    setQ("");
  }

  return (
    <aside className="sidebar">
      <NavLink to="/" className="sidebar-logo">
        <div className="logo-icon">S</div>
        <div className="logo-text">songify</div>
      </NavLink>

      <nav className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive && location.pathname === "/" ? "active" : ""}`}
        >
          <span className="icon">🏠</span> Home
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <span className="icon">🔍</span> Search
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <span className="icon">❤️</span> Favorites
        </NavLink>
        <div className="nav-link" style={{ opacity: 0.5, cursor: "not-allowed" }}>
          <span className="icon">🕒</span> History
        </div>
      </nav>

      <div className="search-section">
        <form onSubmit={onSubmit}>
          <input
            className="sidebar-search"
            placeholder="Search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
      </div>

      <div style={{ marginTop: "auto", padding: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
        Premium Account
      </div>
    </aside>
  );
}
