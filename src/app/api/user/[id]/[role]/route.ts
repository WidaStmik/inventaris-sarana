import { app } from "@/services/admin";
import { getAuth } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  p: { params: { id: string; role: string } }
) {
  const { id, role } = p.params;

  const auth = getAuth(app);
  await auth.setCustomUserClaims(id, { role });

  return NextResponse.json({ id, role });
}
