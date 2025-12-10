/**
 * Small helper to fetch playable stream url (unofficial JioSaavn APIs).
 *
 * Note: These are community/unofficial endpoints. They may change or rate-limit.
 *
 * fetchSongStreamUrl(track)
 *   track can be:
 *     - object returned from search (has id, title, more fields)
 *     - or a { id } or { url } object
 *
 * The helper returns a normalized object { mediaUrl, downloadUrl, data }.
 */

const APG_BASE = "https://apg-saavn-api.herokuapp.com"; // community endpoint (may be rate limited)
const SAAVN_ME = "https://saavn.me"; // other community endpoint

async function jsonFetch(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("API request failed");
  return res.json();
}

export async function searchSongs(query) {
  // use APG search endpoint (unofficial)
  try {
    const url = `${APG_BASE}/result/?q=${encodeURIComponent(query)}&lyrics=true`;
    const data = await jsonFetch(url);
    // data may have results array
    if (data && (data.results || data.data || data.songs)) {
      return data.results || data.data || data.songs;
    }
    return data;
  } catch (e) {
    // fallback to saavn.me search (if available)
    try {
      const url = `${SAAVN_ME}/search?query=${encodeURIComponent(query)}`;
      const data = await jsonFetch(url);
      // adapt based on returned shape
      return data.results || data.data || data.songs || [];
    } catch (err) {
      console.error("Search failed", err);
      return [];
    }
  }
}

export async function fetchSongStreamUrl(track) {
  // Accept track with id, or url or some link
  try {
    // If track has direct id or url, call /song endpoint on APG
    const q = track.id || track.song_id || track.url || track.link || track.permalink || track.title || track.name;
    if (!q) return {};

    // try APG song detail
    try {
      const url = `${APG_BASE}/song/?q=${encodeURIComponent(q)}&lyrics=true`;
      const data = await jsonFetch(url);
      // APG API often returns { results: [ ... ] } or { data: { ... } } or full object
      // Look for fields containing media/download url
      const candidate =
        data?.results?.[0] || data?.data || data?.result || data;
      // Try common keys:
      const mediaUrl =
        candidate?.media_url ||
        candidate?.downloadUrl ||
        candidate?.download_url ||
        candidate?.songUrl ||
        candidate?.mp3_url ||
        candidate?.url;

      return { mediaUrl, downloadUrl: candidate?.downloadUrl, data: candidate };
    } catch (e) {
      // fallback to saavn.me song endpoint
      const url = `${SAAVN_ME}/song?id=${encodeURIComponent(q)}`;
      const data = await jsonFetch(url);
      const candidate = data?.results?.[0] || data?.data || data;
      const mediaUrl =
        candidate?.media_url ||
        candidate?.downloadUrl ||
        candidate?.download_url ||
        candidate?.songUrl ||
        candidate?.mp3_url ||
        candidate?.url;
      return { mediaUrl, downloadUrl: candidate?.downloadUrl, data: candidate };
    }
  } catch (err) {
    console.error("fetchSongStreamUrl error", err);
    return {};
  }
}
