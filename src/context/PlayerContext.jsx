import React, { createContext, useContext, useRef, useState } from "react";
import { fetchSongStreamUrl } from "../api/saavn";

/**
 * PlayerContext provides:
 *  - currentTrack: the currently loaded track metadata
 *  - isPlaying: boolean
 *  - play(track): load track (object) and play it
 *  - pause(), toggle(), next(), prev()
 */
const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]); // array of tracks
  const [index, setIndex] = useState(-1);

  audioRef.current.onended = () => {
    // auto next
    if (index + 1 < queue.length) {
      playAt(index + 1);
    } else {
      setIsPlaying(false);
    }
  };

  async function play(track, addToQueue = true) {
    try {
      // If track has an immediate playable url (some APIs provide direct link)
      let streamUrl = track.streamUrl || track.downloadUrl || track.url || track.previewUrl;

      // If we don't have streamUrl, ask helper to fetch details
      if (!streamUrl) {
        const info = await fetchSongStreamUrl(track); // tries /song endpoint
        // helpers try multiple fields; pick the best
        streamUrl =
          info?.mediaUrl || info?.downloadUrl || info?.data?.media_url || info?.data?.downloadUrl || info?.streamUrl || info?.mp3Url;
      }

      if (!streamUrl) {
        alert("No playable URL found for this track.");
        return;
      }

      // If adding to queue, append and set index to last
      let newIndex = index;
      let newQueue = queue.slice();
      if (addToQueue) {
        newQueue = [...newQueue, { ...track, streamUrl }];
        newIndex = newQueue.length - 1;
        setQueue(newQueue);
      } else {
        // replace queue with single track
        newQueue = [{ ...track, streamUrl }];
        newIndex = 0;
        setQueue(newQueue);
      }

      setIndex(newIndex);
      setCurrentTrack(newQueue[newIndex]);

      // Load audio and play
      audioRef.current.pause();
      audioRef.current.src = newQueue[newIndex].streamUrl || streamUrl;
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Player play error:", err);
      alert("Couldn't play this track. Try another one.");
    }
  }

  async function playAt(i) {
    if (i < 0 || i >= queue.length) return;
    const t = queue[i];
    if (!t.streamUrl) {
      // fetch if missing
      const info = await fetchSongStreamUrl(t);
      t.streamUrl = info?.mediaUrl || info?.downloadUrl || info?.streamUrl || info?.mp3Url;
    }
    setIndex(i);
    setCurrentTrack(t);
    audioRef.current.pause();
    audioRef.current.src = t.streamUrl;
    audioRef.current.currentTime = 0;
    await audioRef.current.play();
    setIsPlaying(true);
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
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export const usePlayer = () => useContext(PlayerContext);
