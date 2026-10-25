import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import ListeningHistory from '../models/ListeningHistory.js';
import { createNeo4jSession } from '../config/neo4j.js';

const recommendationQuery = readFile(
  fileURLToPath(new URL('../neo4j/cypher/02-recommendations.cypher', import.meta.url)),
  'utf8'
);
const playlistQuery = readFile(
  fileURLToPath(new URL('../neo4j/cypher/03-smart-playlist.cypher', import.meta.url)),
  'utf8'
);

function graphId(value) {
  return value?.toString() || null;
}

async function upsertTrack(session, song, artistId = null) {
  const trackId = graphId(song._id);
  await session.run(
    `MERGE (track:Track {mongoId: $trackId})
     SET track.title = $title, track.popularity = $popularity,
         track.duration = $duration, track.image = $image, track.audioUrl = $audioUrl
     OPTIONAL MATCH (artist:Artist {mongoId: $artistId})
     FOREACH (_ IN CASE WHEN artist IS NULL THEN [] ELSE [1] END |
       MERGE (artist)-[:PERFORMED]->(track))
     WITH track
     FOREACH (genreName IN $genres |
       MERGE (genre:Genre {mongoId: toLower(genreName)})
       SET genre.name = genreName
       MERGE (track)-[:IN_GENRE]->(genre))
     FOREACH (moodName IN $moods |
       MERGE (mood:Mood {mongoId: toLower(moodName)})
       SET mood.name = moodName
       MERGE (track)-[:HAS_MOOD]->(mood))`,
    {
      trackId,
      title: song.title,
      popularity: song.plays || 0,
      duration: song.duration || '',
      image: song.image || '',
      audioUrl: song.audioUrl || '',
      artistId: artistId || '',
      genres: song.genres || [],
      moods: song.moods || []
    }
  );
}

export async function syncTrack(song, artistId = null) {
  const session = createNeo4jSession();
  try {
    await upsertTrack(session, song, graphId(artistId));
  } finally {
    await session.close();
  }
}

export async function syncArtist(artist) {
  const session = createNeo4jSession();
  try {
    await session.run(
      `MERGE (artist:Artist {mongoId: $artistId})
       SET artist.name = $name, artist.image = $image`,
      {
        artistId: graphId(artist._id),
        name: artist.name,
        image: artist.image || ''
      }
    );
  } finally {
    await session.close();
  }
}

export async function syncListen(user, song) {
  const session = createNeo4jSession();
  try {
    await upsertTrack(session, song);
    await session.run(
      `MERGE (user:User {mongoId: $userId})
       SET user.username = $username
       WITH user
       MATCH (track:Track {mongoId: $trackId})
       MERGE (user)-[listen:LISTENED_TO]->(track)
       ON CREATE SET listen.playCount = 0
       SET listen.playCount = listen.playCount + 1,
           listen.lastPlayedAt = datetime($playedAt)`,
      {
        userId: graphId(user._id),
        username: user.username,
        trackId: graphId(song._id),
        playedAt: new Date().toISOString()
      }
    );
  } finally {
    await session.close();
  }
}

async function runGraphQuery(query, parameters) {
  const session = createNeo4jSession();
  try {
    const result = await session.run(await query, parameters);
    return result.records.map((record) => Object.fromEntries(
      record.keys.map((key) => {
        const value = record.get(key);
        return [key, value && typeof value.toNumber === 'function' ? value.toNumber() : value];
      })
    ));
  } catch (error) {
    if (!error.statusCode) error.statusCode = 503;
    throw error;
  } finally {
    await session.close();
  }
}

export async function getRecommendations(userId, limit = 20) {
  return runGraphQuery(recommendationQuery, {
    userId: graphId(userId),
    minSimilarity: 0.05,
    limit
  });
}

export async function getSmartPlaylist(trackId, userId, limit = 20) {
  const session = createNeo4jSession();
  try {
    const seed = await session.run(
      'MATCH (track:Track {mongoId: $trackId}) RETURN track.mongoId AS trackId',
      { trackId: graphId(trackId) }
    );
    if (seed.records.length === 0) {
      const error = new Error('Song is not in the Neo4j graph. Run `npm run graph:sync` to synchronize the catalog.');
      error.statusCode = 503;
      throw error;
    }
  } catch (error) {
    if (!error.statusCode) error.statusCode = 503;
    throw error;
  } finally {
    await session.close();
  }
  return runGraphQuery(playlistQuery, {
    trackId: graphId(trackId),
    userId: graphId(userId),
    limit
  });
}

export async function syncListeningHistory() {
  const groups = await ListeningHistory.aggregate([
    { $group: { _id: { user: '$user', song: '$song' }, playCount: { $sum: 1 }, lastPlayedAt: { $max: '$playedAt' } } }
  ]);
  for (const group of groups) {
    const session = createNeo4jSession();
    try {
      await session.run(
        `MERGE (user:User {mongoId: $userId})
         WITH user
         MATCH (track:Track {mongoId: $trackId})
         MERGE (user)-[listen:LISTENED_TO]->(track)
         SET listen.playCount = CASE WHEN coalesce(listen.playCount, 0) < $playCount
                                     THEN $playCount ELSE listen.playCount END,
             listen.lastPlayedAt = datetime($lastPlayedAt)`,
        {
          userId: graphId(group._id.user),
          trackId: graphId(group._id.song),
          playCount: group.playCount,
          lastPlayedAt: group.lastPlayedAt.toISOString()
        }
      );
    } finally {
      await session.close();
    }
  }
}
