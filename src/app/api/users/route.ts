import { app } from "@/services/admin";
import { getAuth } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }
  try {
    const auth = getAuth(app);

    const { uid } = await auth.verifyIdToken(token);
    const user = await auth.getUser(uid);

    if (user.customClaims?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const users = await auth.listUsers();

    return NextResponse.json(users.users.map((user) => user.toJSON()));
  } catch (error) {
    return NextResponse.json(
      { message: "Error in authorization" },
      { status: 401 }
    );
  }
}
