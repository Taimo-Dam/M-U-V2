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

export async function getArtistByName(req, res, next) {
  try {
    const artist = await Artist.findOne({ name: req.params.name });
    if (artist) {
      res.json(artist);
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    next(error);
  }
}

export async function getSongsByArtist(req, res, next) {
  try {
    const artistName = req.params.name;
    const songs = await Song.find({ artist: artistName }).sort({ title: 1 });
    res.json(songs);
  } catch (error) {
    next(error);
  }
}
