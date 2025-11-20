
// app/[code]/route.ts
import { NextResponse } from "next/server";
import { query } from "../lib/db";

export async function GET(_req: Request, { params }: any) {
  const code = params.code;

  // Get URL
  const result = await query(
    `SELECT url FROM links
     WHERE code=$1 AND NOT deleted`,
    [code]
  );

  if (result.rows.length === 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  const url = result.rows[0].url;

  // Update stats
  await query(
    `UPDATE links
     SET clicks = clicks + 1,
         last_clicked = NOW()
     WHERE code=$1`,
    [code]
  );

  return NextResponse.redirect(url, 302);
}
