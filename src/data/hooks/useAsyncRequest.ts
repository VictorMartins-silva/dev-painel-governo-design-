import { useEffect, useState } from "react";
import type { RequestState } from "../../domain/types";

export function useAsyncRequest<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
  isEmpty: (data: T) => boolean = () => false,
): RequestState<T> {
  const [state, setState] = useState<RequestState<T>>({ status: "loading", data: undefined });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", data: undefined });

    fetcher()
      .then((data) => {
        if (cancelled) return;
        setState(
          isEmpty(data) ? { status: "empty", data: undefined } : { status: "success", data },
        );
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Erro desconhecido.";
        setState({ status: "error", data: undefined, error: message });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps é controlado explicitamente pelo chamador (serialização da query)
  }, deps);

  return state;
}
