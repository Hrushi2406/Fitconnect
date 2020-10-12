import neo4j, { auth } from "neo4j-driver";

let driver = neo4j.driver(
  process.env.DB_HOST ?? "",
  auth.basic(process.env.DB_USER ?? "", process.env.DB_PASS ?? "")
);

export default driver;
