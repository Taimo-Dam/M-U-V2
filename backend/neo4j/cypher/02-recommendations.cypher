// Parameters:
// $userId: MongoDB User._id as a string
// $minSimilarity: Jaccard threshold, for example 0.05
// $limit: maximum results, for example 20

MATCH (target:User {mongoId: $userId})
MATCH (target)-[:LISTENED_TO]->(shared:Track)<-[:LISTENED_TO]-(neighbor:User)
WHERE neighbor <> target
WITH target, neighbor, count(DISTINCT shared) AS sharedCount
WITH target, neighbor, sharedCount,
     size([(target)-[:LISTENED_TO]->(track:Track) | track]) AS targetTrackCount,
     size([(neighbor)-[:LISTENED_TO]->(track:Track) | track]) AS neighborTrackCount
WITH target, neighbor,
     toFloat(sharedCount) /
       (targetTrackCount + neighborTrackCount - sharedCount) AS similarity
WHERE similarity >= $minSimilarity
MATCH (neighbor)-[listen:LISTENED_TO]->(candidate:Track)
WHERE NOT EXISTS {
  MATCH (target)-[:LISTENED_TO]->(candidate)
}
WITH candidate,
     sum(similarity * toFloat(listen.playCount)) AS score,
     count(DISTINCT neighbor) AS neighborSupport
RETURN candidate.mongoId AS trackId,
       candidate.title AS title,
       score,
       neighborSupport
ORDER BY score DESC, neighborSupport DESC, title ASC
LIMIT $limit;
