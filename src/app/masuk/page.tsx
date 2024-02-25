"use client";
import { auth } from "@/services/firebase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { Button, Card, Input } from "react-daisyui";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

import { toast } from "react-hot-toast";

export default function Masuk() {
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const router = useRouter();

  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    toast.promise(
      signInWithEmailAndPassword(email, password).then((res) => {
        if (error) {
          throw new Error(error?.message);
        }
      }),
      {
        loading: "Loading...",
        success: (res) => {
          return "Sukses";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen lg:px-16 xl:px-24 lg:bg-gray-50">
      <Card className="w-full lg:w-1/2 bg-white border-0 lg:border lg:shadow-lg">
        <Card.Body>
          <Image
            src="/logo.jpg"
            height={144}
            width={144}
            className="block mx-auto"
            alt="Logo SMK Pasundan 2"
          />
          <h1 className="text-xl font-semibold text-center">
            Masuk ke Sistem Inventaris Sarana SMK Pasundan 2 Bandung
          </h1>

          <form onSubmit={handleLogin}>
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="email@example.com"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <Input type="password" name="password" placeholder="******" />
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              color="primary"
              loading={loading}
            >
              Masuk
            </Button>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
}
