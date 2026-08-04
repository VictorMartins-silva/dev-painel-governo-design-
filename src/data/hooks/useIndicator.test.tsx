import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { DataProviderRoot } from "../DataProviderContext";
import { MockDataProvider } from "../mock/MockDataProvider";
import { useIndicator } from "./useIndicator";

const provider = new MockDataProvider({ simulateLatency: false });

function wrapper({ children }: { children: ReactNode }) {
  return <DataProviderRoot provider={provider}>{children}</DataProviderRoot>;
}

describe("useIndicator", () => {
  it("resolve com valor e comparação com o período anterior", async () => {
    const { result } = renderHook(() => useIndicator({ metric: "saldo_empregos", filters: {} }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status === "success") {
      expect(typeof result.current.data.value).toBe("number");
      expect(result.current.data.comparison).toBeDefined();
    }
  });

  it("é empty quando o filtro não casa com nenhuma linha", async () => {
    const { result } = renderHook(
      () => useIndicator({ metric: "saldo_empregos", filters: { ano: ["1999"] } }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.status).toBe("empty"));
  });
});
