import { NextResponse } from "next/server";

const BOTFUN_API = "https://bot.fun/api/v1";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "address is required" }, { status: 400 });
  }

  try {
    const [agentRes, mentionsRes] = await Promise.all([
      fetch(`${BOTFUN_API}/agents/${address}`, { next: { revalidate: 15 } }),
      fetch(`${BOTFUN_API}/agents/${address}/mentions?page=1&pageSize=10`, {
        next: { revalidate: 15 },
      }),
    ]);

    const agent = await agentRes.json();
    const mentions = await mentionsRes.json();

    return NextResponse.json({ ...agent, mentions });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch agent" },
      { status: 500 }
    );
  }
}