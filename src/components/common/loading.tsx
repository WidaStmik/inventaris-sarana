"use client";
import React from "react";
import { Loading as RDLoading } from "react-daisyui";

interface LoadingProps {
  className?: string;
}

export default function Loading({ className }: LoadingProps) {
  return (
    <div className={className}>
      <RDLoading size="lg" />
    </div>
  );
}
