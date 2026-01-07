import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import ArtistDetails from "./pages/ArtistDetails";
import Search from "./pages/Search";
import PlayerBar from "./components/PlayerBar";
import { PlayerProvider } from "./context/PlayerContext";

import Favorites from "./pages/Favorites";

export default function App() {
  return (
    <PlayerProvider>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/artist/:id" element={<ArtistDetails />} />
              <Route path="/search" element={<Search />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </div>
        </main>
        <PlayerBar />
      </div>
    </PlayerProvider>
  );
}
