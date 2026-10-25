// Put these files in the selected Neo4j DBMS Import folder.
// artists.csv: artistId,name,image
// tracks.csv: trackId,title,artistId,duration,image,audioUrl,popularity,genres,moods
// users.csv: userId,username
// plays.csv: userId,trackId,playCount,lastPlayedAt
// genres and moods are pipe-delimited names, for example "V-pop|Dance-pop".
// Run 00-schema.cypher before this script.

LOAD CSV WITH HEADERS FROM 'file:///users.csv' AS row
WITH row WHERE trim(coalesce(row.userId, '')) <> ''
MERGE (u:User {mongoId: trim(row.userId)})
SET u.username = row.username;

LOAD CSV WITH HEADERS FROM 'file:///artists.csv' AS row
WITH row WHERE trim(coalesce(row.artistId, '')) <> ''
MERGE (a:Artist {mongoId: trim(row.artistId)})
SET a.name = row.name,
    a.image = coalesce(row.image, '');

LOAD CSV WITH HEADERS FROM 'file:///tracks.csv' AS row
WITH row WHERE trim(coalesce(row.trackId, '')) <> ''
MERGE (t:Track {mongoId: trim(row.trackId)})
SET t.title = row.title,
    t.duration = coalesce(row.duration, ''),
    t.image = coalesce(row.image, ''),
    t.audioUrl = coalesce(row.audioUrl, ''),
    t.popularity = CASE
      WHEN trim(coalesce(row.popularity, '')) = '' THEN 0
      ELSE toInteger(row.popularity)
    END;

LOAD CSV WITH HEADERS FROM 'file:///tracks.csv' AS row
WITH row WHERE trim(coalesce(row.trackId, '')) <> ''
MATCH (a:Artist {mongoId: trim(row.artistId)})
MATCH (t:Track {mongoId: trim(row.trackId)})
MERGE (a)-[:PERFORMED]->(t);

LOAD CSV WITH HEADERS FROM 'file:///tracks.csv' AS row
WITH row WHERE trim(coalesce(row.trackId, '')) <> ''
MATCH (t:Track {mongoId: trim(row.trackId)})
WITH t, row,
     CASE WHEN trim(coalesce(row.genres, '')) = ''
       THEN []
       ELSE [name IN split(row.genres, '|') WHERE trim(name) <> '']
     END AS genreNames
UNWIND genreNames AS genreName
MERGE (g:Genre {mongoId: toLower(trim(genreName))})
SET g.name = trim(genreName)
MERGE (t)-[:IN_GENRE]->(g);

LOAD CSV WITH HEADERS FROM 'file:///tracks.csv' AS row
WITH row WHERE trim(coalesce(row.trackId, '')) <> ''
MATCH (t:Track {mongoId: trim(row.trackId)})
WITH t, row,
     CASE WHEN trim(coalesce(row.moods, '')) = ''
       THEN []
       ELSE [name IN split(row.moods, '|') WHERE trim(name) <> '']
     END AS moodNames
UNWIND moodNames AS moodName
MERGE (m:Mood {mongoId: toLower(trim(moodName))})
SET m.name = trim(moodName)
MERGE (t)-[:HAS_MOOD]->(m);

LOAD CSV WITH HEADERS FROM 'file:///plays.csv' AS row
WITH row
WHERE trim(coalesce(row.userId, '')) <> ''
  AND trim(coalesce(row.trackId, '')) <> ''
MATCH (u:User {mongoId: trim(row.userId)})
MATCH (t:Track {mongoId: trim(row.trackId)})
MERGE (u)-[r:LISTENED_TO]->(t)
SET r.playCount = CASE
      WHEN trim(coalesce(row.playCount, '')) = '' THEN 1
      ELSE toInteger(row.playCount)
    END,
    r.lastPlayedAt = CASE
      WHEN trim(coalesce(row.lastPlayedAt, '')) = '' THEN null
      ELSE datetime(row.lastPlayedAt)
    END;
