CREATE CONSTRAINT user_mongo_id_unique IF NOT EXISTS
FOR (n:User) REQUIRE n.mongoId IS UNIQUE;

CREATE CONSTRAINT track_mongo_id_unique IF NOT EXISTS
FOR (n:Track) REQUIRE n.mongoId IS UNIQUE;

CREATE CONSTRAINT artist_mongo_id_unique IF NOT EXISTS
FOR (n:Artist) REQUIRE n.mongoId IS UNIQUE;

CREATE CONSTRAINT genre_mongo_id_unique IF NOT EXISTS
FOR (n:Genre) REQUIRE n.mongoId IS UNIQUE;

CREATE CONSTRAINT mood_mongo_id_unique IF NOT EXISTS
FOR (n:Mood) REQUIRE n.mongoId IS UNIQUE;

CREATE INDEX track_title IF NOT EXISTS
FOR (n:Track) ON (n.title);
