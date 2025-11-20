// app/api/links/[code]/route.ts
import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function GET(_req: Request, { params }: any) {
  const code = params.code;

  const result = await query(
    `SELECT code, url, clicks, last_clicked, created_at
     FROM links
     WHERE code=$1 AND NOT deleted`,
    [code]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

export async function DELETE(_req: Request, { params }: any) {
  const code = params.code;

  const result = await query(
    `UPDATE links
     SET deleted = TRUE
     WHERE code=$1 AND NOT deleted
     RETURNING code`,
    [code]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
