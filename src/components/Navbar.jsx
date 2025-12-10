import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const [q, setQ] = useState("");
  const nav = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    if (q.trim() === "") return;
    nav(`/search?q=${encodeURIComponent(q.trim())}`);
    setQ("");
  }

  return (
    <nav className="navbar">
      <div className="brand">
        <div className="logo">RM</div>
        <div>
          <div style={{fontSize:18}}>songify</div>
          <div style={{fontSize:12, color:"#8fa3a7"}}>30 sec</div>
        </div>
      </div>

      <form className="search-form" onSubmit={onSubmit}>
        <input
          className="search-input"
          placeholder="Search songs, artists..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit" className="search-btn">Search</button>
        <Link to="/" style={{marginLeft:12,color:"#9fb1b6",textDecoration:"none"}}>Home</Link>
      </form>
    </nav>
  );
}
