import mongoose from 'mongoose';
import Song from '../models/Song.js';
import { getRecommendations, getSmartPlaylist } from '../services/graphService.js';

function parseLimit(value) {
  const limit = value === undefined ? 20 : Number(value);
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    const error = new Error('limit must be an integer between 1 and 50');
    error.statusCode = 400;
    throw error;
  }
  return limit;
}

function orderedSongs(rows, songs) {
  const songsById = new Map(songs.map((song) => [song._id.toString(), song]));
  return rows.flatMap((row) => {
    const song = songsById.get(row.trackId);
    return song ? [{ ...row, song }] : [];
  });
}

export async function recommendations(req, res, next) {
  try {
    const rows = await getRecommendations(req.user._id, parseLimit(req.query.limit));
    const songs = await Song.find({ _id: { $in: rows.map((row) => row.trackId) } });
    res.json({
      userId: req.user._id,
      items: orderedSongs(rows, songs).map((row) => ({
        song: row.song,
        score: row.score,
        similarUsers: row.neighborSupport,
        reason: 'popular among listeners with similar taste'
      }))
    });
  } catch (error) {
    next(error);
  }
}

export async function smartPlaylist(req, res, next) {
  try {
    const { trackId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(trackId)) {
      return res.status(400).json({ message: 'trackId must be a valid MongoDB ID' });
    }

    const seed = await Song.findById(trackId);
    if (!seed) {
      return res.status(404).json({ message: 'Song not found' });
    }

    const rows = await getSmartPlaylist(trackId, req.user?._id, parseLimit(req.query.limit));
    const songs = await Song.find({ _id: { $in: rows.map((row) => row.trackId) } });
    res.json({
      seed,
      strategy: 'shared genre, mood, artist and popularity',
      items: orderedSongs(rows, songs).map((row) => ({
        song: row.song,
        score: row.score,
        reason: row.genreMatches
          ? 'shared genre'
          : row.moodMatches
            ? 'shared mood'
            : row.artistMatches
              ? 'same artist'
              : 'popular'
      }))
    });
  } catch (error) {
    next(error);
  }
}
