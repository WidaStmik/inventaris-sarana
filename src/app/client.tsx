"use client";
import { store } from "@/services/store";
import React from "react";
import { Provider } from "react-redux";

export default function ClientProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Provider store={store}>{children}</Provider>;
}
