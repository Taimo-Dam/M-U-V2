import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { closeNeo4jDriver, createNeo4jSession } from '../config/neo4j.js';
import Artist from '../models/Artist.js';
import ListeningHistory from '../models/ListeningHistory.js';
import Song from '../models/Song.js';
import User from '../models/User.js';
import { syncArtist, syncListeningHistory, syncTrack } from '../services/graphService.js';
import { withDefaultSongTags } from './songMetadata.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/meandyou';

async function initializeGraphSchema() {
  const session = createNeo4jSession();
  try {
    for (const label of ['User', 'Track', 'Artist', 'Genre', 'Mood']) {
      await session.run(
        `CREATE CONSTRAINT ${label.toLowerCase()}_mongo_id_unique IF NOT EXISTS
         FOR (node:${label}) REQUIRE node.mongoId IS UNIQUE`
      );
    }
    await session.run('CREATE INDEX track_title IF NOT EXISTS FOR (track:Track) ON (track.title)');
  } finally {
    await session.close();
  }
}

async function migrateRecentHistory() {
  const users = await User.find({ 'listeningHistory.0': { $exists: true } })
    .select('_id listeningHistory')
    .lean();

  for (const user of users) {
    for (const item of user.listeningHistory) {
      await ListeningHistory.updateOne(
        { user: user._id, song: item.song, playedAt: item.playedAt },
        { $setOnInsert: { user: user._id, song: item.song, playedAt: item.playedAt, source: 'history-migration' } },
        { upsert: true }
      );
    }
  }
}

async function syncGraph() {
  await mongoose.connect(MONGO_URI, { autoIndex: true });
  await initializeGraphSchema();

  const artists = await Artist.find().lean();
  const artistsByName = new Map(artists.map((artist) => [artist.name, artist]));
  for (const artist of artists) {
    await syncArtist(artist);
  }

  const songs = await Song.find();
  for (const song of songs) {
    const taggedSong = withDefaultSongTags(song.toObject());
    const tagsChanged = song.genres.join('\0') !== taggedSong.genres.join('\0')
      || song.moods.join('\0') !== taggedSong.moods.join('\0');
    if (tagsChanged) {
      song.genres = taggedSong.genres;
      song.moods = taggedSong.moods;
      await song.save();
    }
    await syncTrack(taggedSong, artistsByName.get(song.artist)?._id);
  }

  await migrateRecentHistory();
  await syncListeningHistory();
  console.log(`Synchronized ${artists.length} artists and ${songs.length} tracks to Neo4j.`);
}

syncGraph()
  .catch((error) => {
    console.error('Graph synchronization failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
    await closeNeo4jDriver();
  });
