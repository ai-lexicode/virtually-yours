import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const BUCKET_NAME = "newsletter-images";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "NO_FILE" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "FILE_TOO_LARGE", maxSize: "2MB" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "INVALID_TYPE", allowed: ALLOWED_TYPES },
        { status: 400 },
      );
    }

    const db = getAdminClient();

    // Ensure bucket exists (idempotent)
    const { error: bucketError } = await db.storage.createBucket(BUCKET_NAME, {
      public: true,
    });
    if (bucketError && !bucketError.message?.includes("already exists")) {
      console.error("[Newsletter Upload] Bucket creation failed:", bucketError);
      // Continue anyway — bucket may exist via SQL migration
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await db.storage
      .from(BUCKET_NAME)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[Newsletter Upload] Upload failed:", uploadError);
      return NextResponse.json({ error: "UPLOAD_FAILED" }, { status: 500 });
    }

    const { data: urlData } = db.storage.from(BUCKET_NAME).getPublicUrl(filename);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error("[Newsletter Upload] POST failed:", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
