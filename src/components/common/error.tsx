import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import React from "react";

export default function RerenderError({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary errorComponent={({ error }) => <div>{children}</div>}>
      {children}
    </ErrorBoundary>
  );
}
