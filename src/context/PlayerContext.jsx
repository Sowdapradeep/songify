import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { fetchSongStreamUrl } from "../api/saavn";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [loading, setLoading] = useState(false);

  // Favorites logic
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("songify_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("songify_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (index + 1 < queue.length) {
        playAt(index + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [index, queue]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  async function play(track, addToQueue = true) {
    setLoading(true);
    try {
      let streamUrl = track.streamUrl || track.downloadUrl || track.url || track.previewUrl;

      if (!streamUrl) {
        const info = await fetchSongStreamUrl(track);
        streamUrl = info?.mediaUrl || info?.downloadUrl || info?.data?.media_url || info?.data?.downloadUrl || info?.streamUrl;
      }

      if (!streamUrl) {
        alert("No playable URL found for this track.");
        setLoading(false);
        return;
      }

      let newIndex = index;
      let newQueue = queue.slice();
      if (addToQueue) {
        newQueue = [...newQueue, { ...track, streamUrl }];
        newIndex = newQueue.length - 1;
        setQueue(newQueue);
      } else {
        newQueue = [{ ...track, streamUrl }];
        newIndex = 0;
        setQueue(newQueue);
      }

      setIndex(newIndex);
      setCurrentTrack(newQueue[newIndex]);

      audioRef.current.pause();
      audioRef.current.src = newQueue[newIndex].streamUrl || streamUrl;
      audioRef.current.load();
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Player play error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function playAt(i) {
    if (i < 0 || i >= queue.length) return;
    setLoading(true);
    const t = queue[i];
    if (!t.streamUrl) {
      const info = await fetchSongStreamUrl(t);
      t.streamUrl = info?.mediaUrl || info?.downloadUrl || info?.streamUrl;
    }
    setIndex(i);
    setCurrentTrack(t);
    audioRef.current.pause();
    audioRef.current.src = t.streamUrl;
    audioRef.current.load();
    await audioRef.current.play();
    setIsPlaying(true);
    setLoading(false);
  }

  function pause() {
    audioRef.current.pause();
    setIsPlaying(false);
  }

  async function toggle() {
    if (!currentTrack) return;
    if (isPlaying) {
      pause();
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
    }
  }

  function seek(time) {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }

  async function next() {
    if (index + 1 < queue.length) {
      await playAt(index + 1);
    }
  }

  async function prev() {
    if (index - 1 >= 0) {
      await playAt(index - 1);
    } else {
      audioRef.current.currentTime = 0;
    }
  }

  function toggleFavorite(track) {
    const isFav = favorites.some(f => f.trackId === track.trackId);
    if (isFav) {
      setFavorites(favorites.filter(f => f.trackId !== track.trackId));
    } else {
      setFavorites([...favorites, track]);
    }
  }

  const value = {
    currentTrack,
    isPlaying,
    play,
    pause,
    toggle,
    next,
    prev,
    queue,
    setQueue,
    playAt,
    audioRef,
    duration,
    currentTime,
    seek,
    volume,
    setVolume,
    loading,
    favorites,
    toggleFavorite
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export const usePlayer = () => useContext(PlayerContext);
