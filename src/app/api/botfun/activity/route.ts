import { NextResponse } from "next/server";

const BOTFUN_API = "https://bot.fun/api/v1";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "50";

  try {
    const res = await fetch(
      `${BOTFUN_API}/activity?page=${page}&pageSize=${pageSize}`,
      { next: { revalidate: 10 } }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}