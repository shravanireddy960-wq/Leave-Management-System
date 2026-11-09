import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ushclifzywulvkihdjms.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function test() {
  console.log("🔗 Connecting to Supabase Client...");
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // 1. Read profiles
  const { data: profiles, error: pErr } = await supabase.from("profiles").select("id, full_name, email, role, designation");
  if (pErr) throw pErr;
  console.log(`\n✅ Read Profiles (${profiles.length} records):`);
  console.table(profiles);

  // 2. Read Leave Types
  const { data: leaveTypes, error: ltErr } = await supabase.from("leave_types").select("code, name, annual_quota, is_paid");
  if (ltErr) throw ltErr;
  console.log(`\n✅ Read Leave Types (${leaveTypes.length} records):`);
  console.table(leaveTypes);

  // 3. RPC Call: calculate_working_days
  const { data: workingDays, error: rpcErr } = await supabase.rpc("calculate_working_days", {
    p_start_date: "2025-11-10",
    p_end_date: "2025-11-14",
    p_exclude_weekends: true,
    p_exclude_holidays: true,
  });
  if (rpcErr) throw rpcErr;
  console.log(`\n✅ RPC Function 'calculate_working_days' (2025-11-10 to 2025-11-14) Result: ${workingDays} days`);

  // 4. Test Write Access: Insert an Audit Log record
  console.log("\n✍️ Testing Write Access (INSERT into audit_logs)...");
  const testLog = {
    action: "SYSTEM_INITIALIZED",
    entity_type: "database",
    entity_id: "ushclifzywulvkihdjms",
    new_values: { message: "Supabase connection verified successfully", timestamp: new Date().toISOString() },
  };

  const { data: inserted, error: wErr } = await supabase.from("audit_logs").insert(testLog).select();
  if (wErr) throw wErr;
  console.log("✅ Successfully wrote record to audit_logs:", inserted[0].id);

  // 5. Verify Read-back of written record
  const { data: readBack, error: rErr } = await supabase.from("audit_logs").select("*").eq("id", inserted[0].id).single();
  if (rErr) throw rErr;
  console.log("✅ Read back written record:", readBack.action, "-", readBack.entity_id);

  console.log("\n🎉 Full Read & Write Connection to Supabase is 100% OPERATIONAL!");
}

test().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});

