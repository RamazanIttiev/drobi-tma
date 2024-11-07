import {
  type ComponentType,
  type PropsWithChildren,
  type ReactNode,
  useState,
} from "react";

interface ErrorBoundaryProps extends PropsWithChildren {
  fallback?: ReactNode | ComponentType<{ error: unknown }>;
}

export const ErrorBoundary = ({
  fallback: Fallback,
  children,
}: ErrorBoundaryProps) => {
  const [error, setError] = useState<unknown>(null);

  if (error) {
    return typeof Fallback === "function" ? (
      <Fallback error={error} />
    ) : (
      (Fallback ?? null)
    );
  }

  try {
    return <>{children}</>;
  } catch (error) {
    setError(error);
    return null;
  }
};
