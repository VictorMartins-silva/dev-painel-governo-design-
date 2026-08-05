import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { DataProviderRoot } from "../DataProviderContext";
import { MockDataProvider } from "../mock/MockDataProvider";
import { useIndicatorList } from "./useIndicatorList";

const provider = new MockDataProvider({ simulateLatency: false });

function wrapper({ children }: { children: ReactNode }) {
  return <DataProviderRoot provider={provider}>{children}</DataProviderRoot>;
}

describe("useIndicatorList", () => {
  it("resolve com o catálogo de indicadores do provider", async () => {
    const { result } = renderHook(() => useIndicatorList(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status === "success") {
      expect(result.current.data.some((indicator) => indicator.id === "populacao_total")).toBe(
        true,
      );
    }
  });
});
