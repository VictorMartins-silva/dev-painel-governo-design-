import type { ReactNode } from "react";
import type { RequestState } from "../../domain/types";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";

type AsyncBoundaryProps<T> = {
  state: RequestState<T>;
  children: (data: T) => ReactNode;
  loadingLabel?: string;
  emptyTitle?: string;
  emptyMessage?: string;
};

export function AsyncBoundary<T>({
  state,
  children,
  loadingLabel,
  emptyTitle,
  emptyMessage,
}: AsyncBoundaryProps<T>) {
  if (state.status === "loading") {
    return <LoadingState label={loadingLabel} />;
  }

  if (state.status === "error") {
    return <ErrorState message={state.error} />;
  }

  if (state.status === "empty") {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return <>{children(state.data)}</>;
}
