import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("prisma/dev.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS "Simulation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shareSlug" TEXT NOT NULL UNIQUE,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "inputJson" TEXT NOT NULL,
    "resultJson" TEXT NOT NULL,
    "imageUrl" TEXT,
    "textSource" TEXT NOT NULL DEFAULT 'mock',
    "branchJson" TEXT,
    "partnerJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const simulationColumns = db.prepare(`PRAGMA table_info("Simulation")`).all() as Array<{ name: string }>;
const existingColumns = new Set(simulationColumns.map((column) => column.name));

const optionalColumns: Array<[string, string]> = [
  ["userId", `ALTER TABLE "Simulation" ADD COLUMN "userId" TEXT`],
  ["imageUrl", `ALTER TABLE "Simulation" ADD COLUMN "imageUrl" TEXT`],
  ["textSource", `ALTER TABLE "Simulation" ADD COLUMN "textSource" TEXT NOT NULL DEFAULT 'mock'`],
  ["branchJson", `ALTER TABLE "Simulation" ADD COLUMN "branchJson" TEXT`],
  ["partnerJson", `ALTER TABLE "Simulation" ADD COLUMN "partnerJson" TEXT`],
];

for (const [column, sql] of optionalColumns) {
  if (!existingColumns.has(column)) {
    db.exec(sql);
  }
}

db.close();

console.log("SQLite database initialized at prisma/dev.db");
