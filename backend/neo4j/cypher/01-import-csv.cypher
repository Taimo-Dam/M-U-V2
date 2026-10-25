// Run with CSV files placed in Neo4j's import directory.
// artists.csv: artistId,name
// genres.csv: genreId,name
// moods.csv: moodId,name
// tracks.csv: trackId,title,artistId,duration,image,audioUrl,popularity,genreIds,moodIds
// users.csv: userId,username
// plays.csv: userId,trackId,playCount,lastPlayedAt
// genreIds and moodIds are pipe-delimited MongoDB IDs, for example "id1|id2".

LOAD CSV WITH HEADERS FROM 'file:///users.csv' AS row
MERGE (u:User {mongoId: trim(row.userId)})
SET u.username = row.username;

LOAD CSV WITH HEADERS FROM 'file:///artists.csv' AS row
MERGE (a:Artist {mongoId: trim(row.artistId)})
SET a.name = row.name;

LOAD CSV WITH HEADERS FROM 'file:///genres.csv' AS row
MERGE (g:Genre {mongoId: trim(row.genreId)})
SET g.name = row.name;

LOAD CSV WITH HEADERS FROM 'file:///moods.csv' AS row
MERGE (m:Mood {mongoId: trim(row.moodId)})
SET m.name = row.name;

LOAD CSV WITH HEADERS FROM 'file:///tracks.csv' AS row
MERGE (t:Track {mongoId: trim(row.trackId)})
SET t.title = row.title,
    t.duration = row.duration,
    t.image = row.image,
    t.audioUrl = row.audioUrl,
    t.popularity = CASE
      WHEN trim(coalesce(row.popularity, '')) = '' THEN 0
      ELSE toInteger(row.popularity)
    END;

LOAD CSV WITH HEADERS FROM 'file:///tracks.csv' AS row
MATCH (a:Artist {mongoId: trim(row.artistId)})
MATCH (t:Track {mongoId: trim(row.trackId)})
MERGE (a)-[:PERFORMED]->(t);

LOAD CSV WITH HEADERS FROM 'file:///tracks.csv' AS row
MATCH (t:Track {mongoId: trim(row.trackId)})
WITH t, row,
     CASE WHEN trim(coalesce(row.genreIds, '')) = ''
       THEN []
       ELSE [id IN split(row.genreIds, '|') WHERE trim(id) <> '']
     END AS genreIds
UNWIND genreIds AS genreId
MATCH (g:Genre {mongoId: trim(genreId)})
MERGE (t)-[:IN_GENRE]->(g);

LOAD CSV WITH HEADERS FROM 'file:///tracks.csv' AS row
MATCH (t:Track {mongoId: trim(row.trackId)})
WITH t, row,
     CASE WHEN trim(coalesce(row.moodIds, '')) = ''
       THEN []
       ELSE [id IN split(row.moodIds, '|') WHERE trim(id) <> '']
     END AS moodIds
UNWIND moodIds AS moodId
MATCH (m:Mood {mongoId: trim(moodId)})
MERGE (t)-[:HAS_MOOD]->(m);

LOAD CSV WITH HEADERS FROM 'file:///plays.csv' AS row
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
