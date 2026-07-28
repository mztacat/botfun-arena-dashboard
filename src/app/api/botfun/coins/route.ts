import { NextResponse } from "next/server";

const BOTFUN_API = "https://bot.fun/api/v1";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "address is required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BOTFUN_API}/coins/${address}`, {
      next: { revalidate: 15 },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch coin" },
      { status: 500 }
    );
  }
}