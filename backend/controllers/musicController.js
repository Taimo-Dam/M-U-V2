import Album from '../models/Album.js';
import Artist from '../models/Artist.js';
import Song from '../models/Song.js';
import User from '../models/User.js';

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

export async function recordPlay(req, res, next) {
  try {
    const songId = req.params.id;
    
    // 1. Increment global plays
    const song = await Song.findByIdAndUpdate(songId, { $inc: { plays: 1 } }, { new: true });
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // 2. If user is logged in, add to history
    if (req.user) {
      const user = await User.findById(req.user._id);
      
      // Remove previous play of this song to avoid duplicates in history
      user.listeningHistory = user.listeningHistory.filter(h => h.song.toString() !== songId);
      
      // Add new play at the beginning
      user.listeningHistory.unshift({ song: songId, playedAt: Date.now() });
      
      // Limit history to 50 items to prevent document from growing indefinitely
      if (user.listeningHistory.length > 50) {
        user.listeningHistory.pop();
      }
      
      await user.save();
    }

    res.json({ message: 'Play recorded', plays: song.plays });
  } catch (error) {
    next(error);
  }
}
