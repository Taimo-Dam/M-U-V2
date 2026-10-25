// Parameters:
// $trackId: MongoDB Song._id as a string
// $userId: MongoDB User._id as a string, or null for anonymous requests
// $limit: maximum results, for example 20
//
// Genre contributes 3 points, Mood 2 points, and popularity contributes
// a logarithmic bonus so that popularity does not dominate metadata matches.

MATCH (seed:Track {mongoId: $trackId})
OPTIONAL MATCH (listener:User {mongoId: $userId})
CALL {
  WITH seed
  MATCH (seed)-[:IN_GENRE]->(genre:Genre)<-[:IN_GENRE]-(candidate:Track)
  WHERE candidate <> seed
  RETURN candidate, count(DISTINCT genre) AS genreMatches, 0 AS moodMatches, 0 AS artistMatches
  UNION ALL
  WITH seed
  MATCH (seed)-[:HAS_MOOD]->(mood:Mood)<-[:HAS_MOOD]-(candidate:Track)
  WHERE candidate <> seed
  RETURN candidate, 0 AS genreMatches, count(DISTINCT mood) AS moodMatches, 0 AS artistMatches
  UNION ALL
  WITH seed
  MATCH (seed)<-[:PERFORMED]-(artist:Artist)-[:PERFORMED]->(candidate:Track)
  WHERE candidate <> seed
  RETURN candidate, 0 AS genreMatches, 0 AS moodMatches, count(DISTINCT artist) AS artistMatches
}
WITH listener, candidate,
     sum(genreMatches) AS genreMatches,
     sum(moodMatches) AS moodMatches,
     sum(artistMatches) AS artistMatches
WHERE listener IS NULL OR NOT EXISTS {
  MATCH (listener)-[:LISTENED_TO]->(candidate)
}
WITH candidate, genreMatches, moodMatches, artistMatches,
     genreMatches * 3 + moodMatches * 2 + artistMatches +
       log(1.0 + toFloat(coalesce(candidate.popularity, 0))) AS score
RETURN candidate.mongoId AS trackId,
       candidate.title AS title,
       genreMatches,
       moodMatches,
       artistMatches,
       score
ORDER BY score DESC, candidate.title ASC
LIMIT $limit;
