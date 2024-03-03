import React from "react";

export interface ComponentProps {
  children: React.ReactNode;
}

export interface PageProps {
  params: Record<string, string>;
}
