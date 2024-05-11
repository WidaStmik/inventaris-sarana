import { getAuth } from "@/services/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const auth = getAuth();
    const { uid, ...claims } = await auth.verifyIdToken(token);
    const user = await auth.getUser(uid);

    return NextResponse.json({ ...user, ...claims });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in authorization" },
      { status: 401 }
    );
  }
}
