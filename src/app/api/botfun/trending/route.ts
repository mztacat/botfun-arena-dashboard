import { NextResponse } from "next/server";

const BOTFUN_API = "https://bot.fun/api/v1";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "20";

  try {
    const res = await fetch(`${BOTFUN_API}/coins/trending?limit=${limit}`, {
      next: { revalidate: 30 },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch trending coins" }, { status: 500 });
  }
}