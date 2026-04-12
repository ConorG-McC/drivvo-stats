import { NextRequest, NextResponse } from "next/server";
import { drivvoLogin } from "@/lib/drivvo";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json() as { email: string; password: string };
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const token = await drivvoLogin(email, password);

    const res = NextResponse.json({ ok: true });
    res.cookies.set("drivvo_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Login failed";
    const status = message.includes("401") || message.includes("Login failed") ? 401 : 500;
    return NextResponse.json({ error: "Invalid email or password" }, { status });
  }
}
