"use client";

import { auth } from "@/services/firebase";
import Image from "next/image";
import { Button } from "react-daisyui";
import { useSignOut } from "react-firebase-hooks/auth";

export default function Home() {
  const [signOut, loading, error] = useSignOut(auth);

  return (
    <div>
      <Button onClick={signOut}>Sign Out</Button>
    </div>
  );
}
