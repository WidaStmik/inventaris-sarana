import React from "react";

export interface ComponentProps {
  children: React.ReactNode;
}

export interface PageProps {
  params: Record<string, string>;
}

export type FunctionLike = (...args: any[]) => any;
