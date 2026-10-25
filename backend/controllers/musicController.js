import mongoose from 'mongoose';
import Album from '../models/Album.js';
import Artist from '../models/Artist.js';
import Song from '../models/Song.js';
import User from '../models/User.js';
import ListeningHistory from '../models/ListeningHistory.js';
import { syncListen, syncTrack } from '../services/graphService.js';

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

function normalizeName(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ''); // remove non-alphanumeric characters
}

export async function getArtistByName(req, res, next) {
  try {
    const queryNormalized = normalizeName(req.params.name);
    const artists = await Artist.find();
    
    const matchedArtist = artists.find(artist => {
      const artistNormalized = normalizeName(artist.name);
      return artistNormalized.includes(queryNormalized) || queryNormalized.includes(artistNormalized);
    });

    if (matchedArtist) {
      res.json(matchedArtist);
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    next(error);
  }
}

export async function getSongsByArtist(req, res, next) {
  try {
    const queryNormalized = normalizeName(req.params.name);
    const artists = await Artist.find();
    
    const matchedArtist = artists.find(artist => {
      const artistNormalized = normalizeName(artist.name);
      return artistNormalized.includes(queryNormalized) || queryNormalized.includes(artistNormalized);
    });

    const artistName = matchedArtist ? matchedArtist.name : req.params.name;
    const songs = await Song.find({ artist: artistName }).sort({ title: 1 });
    res.json(songs);
  } catch (error) {
    next(error);
  }
}

export async function recordPlay(req, res, next) {
  try {
    const songId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: 'Song ID is invalid' });
    }
    
    // 1. Increment global plays
    const song = await Song.findByIdAndUpdate(songId, { $inc: { plays: 1 } }, { new: true });
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    let graphSynced = true;
    // 2. If user is logged in, add to history
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user no longer exists' });
      }

      await ListeningHistory.create({ user: user._id, song: songId });
      
      // Remove previous play of this song to avoid duplicates in history
      user.listeningHistory = user.listeningHistory.filter(h => h.song.toString() !== songId);
      
      // Add new play at the beginning
      user.listeningHistory.unshift({ song: songId, playedAt: Date.now() });
      
      // Limit history to 50 items to prevent document from growing indefinitely
      if (user.listeningHistory.length > 50) {
        user.listeningHistory.pop();
      }
      
      await user.save();

      try {
        await syncListen(user, song);
      } catch (error) {
        graphSynced = false;
        console.error('Failed to sync play to Neo4j; run `npm run graph:sync` to reconcile:', error);
      }
    } else {
      try {
        await syncTrack(song);
      } catch (error) {
        graphSynced = false;
        console.error('Failed to sync song popularity to Neo4j; run `npm run graph:sync` to reconcile:', error);
      }
    }

    res.json({ message: 'Play recorded', plays: song.plays, graphSynced });
  } catch (error) {
    next(error);
  }
}

export async function search(req, res, next) {
  try {
    const q = req.query.q || '';
    if (!q) {
      return res.json({ songs: [], artists: [] });
    }
    const queryNormalized = normalizeName(q);
    
    const [allSongs, allArtists] = await Promise.all([
      Song.find(),
      Artist.find()
    ]);
    
    const matchedArtists = allArtists.filter(artist => {
      const nameNorm = normalizeName(artist.name);
      return nameNorm.includes(queryNormalized) || queryNormalized.includes(nameNorm);
    }).slice(0, 5);
    
    const matchedSongs = allSongs.filter(song => {
      const titleNorm = normalizeName(song.title);
      const artistNorm = normalizeName(song.artist);
      return titleNorm.includes(queryNormalized) || 
             artistNorm.includes(queryNormalized) ||
             queryNormalized.includes(titleNorm) ||
             queryNormalized.includes(artistNorm);
    }).slice(0, 5);
    
    res.json({
      songs: matchedSongs,
      artists: matchedArtists
    });
  } catch (error) {
    next(error);
  }
}
