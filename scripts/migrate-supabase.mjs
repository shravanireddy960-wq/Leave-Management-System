import fs from "fs";
import path from "path";

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || "ushclifzywulvkihdjms";
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || "";
const API_URL = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`;

async function executeSql(query) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`SQL Execution failed (${response.status}): ${text}`);
  }

  return response.json();
}

async function run() {
  console.log("🚀 [1/4] Applying Schema (supabase/schema.sql)...");
  const schemaSql = fs.readFileSync(path.resolve("supabase/schema.sql"), "utf8");
  await executeSql(schemaSql);
  console.log("✅ Schema applied successfully!");

  console.log("\n🌱 [2/4] Applying Seed Data (supabase/seed.sql)...");
  const seedSql = fs.readFileSync(path.resolve("supabase/seed.sql"), "utf8");
  await executeSql(seedSql);
  console.log("✅ Seed data inserted successfully!");

  console.log("\n🔍 [3/4] Verifying Tables & Row Counts in Supabase...");
  const tableCheckQuery = `
    SELECT table_name,
           (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count
    FROM (
      SELECT table_name,
             query_to_xml(format('SELECT count(*) as cnt FROM %I', table_name), false, true, '') as xml_count
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ) t
    ORDER BY table_name;
  `;
  const tables = await executeSql(tableCheckQuery);
  console.table(tables);

  console.log("\n⚙️ [4/4] Verifying Stored Procedures...");
  const procCheckQuery = `
    SELECT routine_name, routine_type
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    ORDER BY routine_name;
  `;
  const procedures = await executeSql(procCheckQuery);
  console.table(procedures);

  console.log("\n✨ Supabase verification completed successfully!");
}

run().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});

