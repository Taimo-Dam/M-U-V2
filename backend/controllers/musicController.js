import Album from '../models/Album.js';
import Artist from '../models/Artist.js';
import Song from '../models/Song.js';

export async function getSongs(req, res, next) {
  try {
    const songs = await Song.find().sort({ title: 1 });
    res.json(songs);
  } catch (error) {
    next(error);
  }
}

export async function getArtists(req, res, next) {
  try {
    const artists = await Artist.find().sort({ name: 1 });
    res.json(artists);
  } catch (error) {
    next(error);
  }
}

export async function getAlbums(req, res, next) {
  try {
    const albums = await Album.find().sort({ title: 1 });
    res.json(albums);
  } catch (error) {
    next(error);
  }
}
