import neo4j from 'neo4j-driver';

let driver;

export function getNeo4jDriver() {
  if (driver) return driver;

  const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;
  if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
    const error = new Error('Neo4j is not configured. Set NEO4J_URI, NEO4J_USERNAME and NEO4J_PASSWORD.');
    error.statusCode = 503;
    throw error;
  }

  driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
  return driver;
}

export function createNeo4jSession() {
  const database = process.env.NEO4J_DATABASE;
  return getNeo4jDriver().session(database ? { database } : undefined);
}

export async function closeNeo4jDriver() {
  if (!driver) return;
  const currentDriver = driver;
  driver = undefined;
  await currentDriver.close();
}
