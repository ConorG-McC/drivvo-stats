import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { vehicleId } = await req.json() as { vehicleId: string };
  if (!vehicleId) return NextResponse.json({ error: "vehicleId required" }, { status: 400 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("drivvo_vehicle_id", vehicleId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
