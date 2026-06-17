import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function fetchSongs() {
  const response = await api.get('/songs');
  return response.data;
}

export async function fetchArtists() {
  const response = await api.get('/artists');
  return response.data;
}

export async function fetchAlbums() {
  const response = await api.get('/albums');
  return response.data;
}

export async function fetchArtistByName(name) {
  const response = await api.get(`/artists/${encodeURIComponent(name)}`);
  return response.data;
}

export async function fetchSongsByArtist(name) {
  const response = await api.get(`/artists/${encodeURIComponent(name)}/songs`);
  return response.data;
}

export async function recordPlay(songId, token) {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await api.post(`/songs/${songId}/play`, {}, config);
  return response.data;
}

export async function getHistory(token) {
  if (!token) return [];
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await api.get('/auth/history', config);
  return response.data;
}

export async function searchMusic(query) {
  const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
  return response.data;
}
