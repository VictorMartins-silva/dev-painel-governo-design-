import "@testing-library/jest-dom/vitest";
import { z } from "zod";

// Mensagens de validação padrão do Zod (invalid_type, enum, etc.) em português, como em produção.
z.config(z.locales.pt());

class MockCanvasRenderingContext2D {
  fillStyle = "";
  strokeStyle = "";
  lineWidth = 1;
  font = "";
  globalAlpha = 1;

  save() {}
  restore() {}
  translate() {}
  scale() {}
  rotate() {}
  transform() {}
  setTransform() {}
  resetTransform() {}
  beginPath() {}
  closePath() {}
  moveTo() {}
  lineTo() {}
  bezierCurveTo() {}
  quadraticCurveTo() {}
  arc() {}
  arcTo() {}
  rect() {}
  clip() {}
  fill() {}
  stroke() {}
  fillRect() {}
  clearRect() {}
  strokeRect() {}
  fillText() {}
  strokeText() {}
  setLineDash() {}
  getLineDash() {
    return [];
  }
  measureText() {
    return { width: 0 } as TextMetrics;
  }
  createLinearGradient() {
    return { addColorStop() {} };
  }
  createRadialGradient() {
    return { addColorStop() {} };
  }
  createPattern() {
    return null;
  }
  drawImage() {}
  getImageData() {
    return { data: new Uint8ClampedArray(0) };
  }
  putImageData() {}
}

// jsdom não implementa o Canvas 2D real; o ECharts precisa de um contexto mínimo para não lançar erro.
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: () => new MockCanvasRenderingContext2D(),
});

// jsdom não implementa ResizeObserver, usado pelo EChartsBase para redimensionar o gráfico.
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "ResizeObserver", { value: MockResizeObserver });

// jsdom não implementa matchMedia, usado para detectar o esquema de cores (claro/escuro).
Object.defineProperty(window, "matchMedia", {
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() {
      return false;
    },
  }),
});
