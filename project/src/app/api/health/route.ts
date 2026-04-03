import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from("profiles").select("id", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ status: "degraded", db: "error" }, { status: 503 });
    }

    return NextResponse.json({ status: "ok", db: "connected" });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
