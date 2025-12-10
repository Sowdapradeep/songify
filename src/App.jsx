import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ArtistDetails from "./pages/ArtistDetails";
import Search from "./pages/Search";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artist/:id" element={<ArtistDetails />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </main>
    </div>
  );
}
