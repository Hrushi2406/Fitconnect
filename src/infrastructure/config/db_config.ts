import neo4j, { auth } from "neo4j-driver";

let driver = neo4j.driver(
  "bolt://localhost:7687",
  auth.basic("neo4j", "123456")
);

export default driver;
