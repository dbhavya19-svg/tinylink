// app/api/links/route.ts
import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { validateUrl, generateCode, CODE_REGEX } from "../../../lib/utils";

export async function GET() {
  const result = await query(
    `SELECT code, url, clicks, last_clicked, created_at
     FROM links
     WHERE NOT deleted
     ORDER BY created_at DESC`
  );

  return NextResponse.json(result.rows);
}

export async function POST(req: Request) {
  let body: any = null;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const url = body?.url?.trim();
  let code = body?.code?.trim() || null;

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  if (!validateUrl(url)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // If custom code is provided
  if (code) {
    if (!CODE_REGEX.test(code)) {
      return NextResponse.json(
        { error: "Custom code must match [A-Za-z0-9]{6,8}" },
        { status: 400 }
      );
    }

    const exists = await query(`SELECT code FROM links WHERE code=$1`, [code]);
    if (exists.rows.length > 0) {
      return NextResponse.json({ error: "Code already exists" }, { status: 409 });
    }
  }

  // If no custom code, auto-generate one
  if (!code) {
    let attempts = 0;
    do {
      code = generateCode(6);
      const exists = await query(`SELECT code FROM links WHERE code=$1`, [code]);
      if (exists.rows.length === 0) break;
      attempts++;
    } while (attempts < 5);

    if (!code) {
      return NextResponse.json(
        { error: "Failed to generate unique code" },
        { status: 500 }
      );
    }
  }

  // Insert into DB
  await query(
    `INSERT INTO links (code, url)
     VALUES ($1, $2)`,
    [code, url]
  );

  return NextResponse.json({ code, url }, { status: 201 });
}
