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
