import pkg from "pg";

const { Pool } = pkg;
const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({
  allowExitOnIdle: true,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});
