// Idempotent projection of the authoritative MongoDB aggregate for one
// user-track pair. Upsert User and Track metadata before running this query.
// Parameters:
// $userId: MongoDB User._id as a string
// $trackId: MongoDB Song._id as a string
// $playCount: authoritative aggregate count from MongoDB
// $lastPlayedAt: ISO-8601 timestamp string

MATCH (u:User {mongoId: $userId})
MATCH (t:Track {mongoId: $trackId})
MERGE (u)-[listen:LISTENED_TO]->(t)
ON CREATE SET listen.playCount = 0
SET listen.playCount = CASE
      WHEN coalesce(listen.playCount, 0) < $playCount THEN $playCount
      ELSE listen.playCount
    END,
    listen.lastPlayedAt = CASE
      WHEN listen.lastPlayedAt IS NULL
        OR listen.lastPlayedAt < datetime($lastPlayedAt)
      THEN datetime($lastPlayedAt)
      ELSE listen.lastPlayedAt
    END
RETURN listen.playCount AS playCount, listen.lastPlayedAt AS lastPlayedAt;
