import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { DataProviderRoot } from "../DataProviderContext";
import { MockDataProvider } from "../mock/MockDataProvider";
import { useTimeSeries } from "./useTimeSeries";

const provider = new MockDataProvider({ simulateLatency: false });

function wrapper({ children }: { children: ReactNode }) {
  return <DataProviderRoot provider={provider}>{children}</DataProviderRoot>;
}

describe("useTimeSeries", () => {
  it("começa em loading e resolve para success com dados existentes", async () => {
    const { result } = renderHook(() => useTimeSeries({ metric: "saldo_empregos", filters: {} }), {
      wrapper,
    });

    expect(result.current.status).toBe("loading");

    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status === "success") {
      expect(result.current.data.length).toBeGreaterThan(0);
      expect(result.current.data[0]).toHaveProperty("period");
    }
  });

  it("filtra por dataField em memória (ano)", async () => {
    const { result } = renderHook(
      () => useTimeSeries({ metric: "saldo_empregos", filters: { ano: ["2024"] } }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status === "success") {
      expect(result.current.data.every((point) => point.period.startsWith("2024"))).toBe(true);
    }
  });

  it("retorna empty quando a métrica não existe", async () => {
    const { result } = renderHook(
      () => useTimeSeries({ metric: "metrica_inexistente", filters: {} }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.status).toBe("empty"));
  });

  it("retorna error quando o provider rejeita", async () => {
    const { result } = renderHook(() => useTimeSeries({ metric: "__mock_error__", filters: {} }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.status).toBe("error"));
    if (result.current.status === "error") {
      expect(result.current.error).toMatch(/erro simulado/i);
    }
  });
});
