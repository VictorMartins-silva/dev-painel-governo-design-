import { useCallback, useEffect, useRef, useState } from "react";
import type { CollectionConfig } from "../config/schemas/collection.schema";
import type { PanelConfig } from "../config/schemas/panel.schema";
import { ConfigRenderer } from "./ConfigRenderer";
import { EmbedPanelView } from "./EmbedPanelView";
import styles from "./KioskPlayer.module.css";

type KioskSlide = {
  panel: PanelConfig;
  timerSeconds: number;
};

type KioskPlayerProps = {
  collection: CollectionConfig;
  slides: KioskSlide[];
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Player de rotação de Apresentações: todos os slides ficam montados o tempo todo,
 * alternando só a visibilidade — evita a tela branca de remontar iframe a cada troca.
 * Os slides só são remontados de fato a cada N voltas completas (refreshEveryCycles).
 */
export function KioskPlayer({ collection, slides }: KioskPlayerProps) {
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(() => slides[0]?.timerSeconds ?? 0);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [generation, setGeneration] = useState(0);
  const loopCountRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToIndex = useCallback(
    (newIndex: number, { isLoop }: { isLoop: boolean }) => {
      if (isLoop) {
        loopCountRef.current += 1;
        if (loopCountRef.current % collection.refreshEveryCycles === 0) {
          setGeneration((g) => g + 1);
        }
      }
      setIndex(newIndex);
      setRemaining(slides[newIndex]?.timerSeconds ?? 0);
    },
    [slides, collection.refreshEveryCycles],
  );

  const goNext = useCallback(() => {
    if (slides.length === 0) return;
    const newIndex = (index + 1) % slides.length;
    goToIndex(newIndex, { isLoop: newIndex === 0 });
  }, [index, slides.length, goToIndex]);

  const goPrev = useCallback(() => {
    if (slides.length === 0) return;
    const newIndex = (index - 1 + slides.length) % slides.length;
    goToIndex(newIndex, { isLoop: false });
  }, [index, slides.length, goToIndex]);

  useEffect(() => {
    if (!playing || slides.length <= 1) return undefined;
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [playing, slides.length]);

  useEffect(() => {
    if (remaining > 0) return;
    goNext();
  }, [remaining, goNext]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") goNext();
      else if (event.key === "ArrowLeft") goPrev();
      else if (event.key === " ") {
        event.preventDefault();
        setPlaying((p) => !p);
      } else if (event.key.toLowerCase() === "f") {
        void toggleFullscreen();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await containerRef.current?.requestFullscreen();
    }
  }

  if (slides.length === 0) {
    return (
      <div className={styles.kiosk}>
        <p className={styles.empty}>Nenhum painel disponível nesta coleção.</p>
      </div>
    );
  }

  const current = slides[index];
  const next = slides[(index + 1) % slides.length];

  return (
    <div className={styles.kiosk} ref={containerRef}>
      <div className={styles.top}>
        <b>{collection.title}</b>
        <span>·</span>
        <span>
          {index + 1} de {slides.length}
        </span>
        <div className={styles.right}>
          <span>{current.panel.title}</span>
          <span className={styles.tag}>
            {current.panel.kind === "external" ? "externo · abre fora do kiosk" : "embed nativo"}
          </span>
        </div>
      </div>

      <div className={styles.stage} aria-live="polite">
        {slides.map((slide, slideIndex) => (
          <div
            key={`${slide.panel.id}-${generation}`}
            className={slideIndex === index ? styles.slideVisible : styles.slideHidden}
            aria-hidden={slideIndex !== index}
          >
            {slide.panel.kind === "external" ? (
              <EmbedPanelView panel={slide.panel} />
            ) : (
              <ConfigRenderer panelId={slide.panel.id} config={slide.panel} />
            )}
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button type="button" onClick={goPrev} aria-label="Painel anterior">
          ⏮
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pausar rotação" : "Retomar rotação"}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <button type="button" onClick={goNext} aria-label="Próximo painel">
          ⏭
        </button>
        <span className={styles.dots}>
          {slides.map((slide, dotIndex) => (
            <button
              key={slide.panel.id}
              type="button"
              className={dotIndex === index ? styles.dotOn : styles.dot}
              aria-label={`Ir para ${slide.panel.title}`}
              aria-current={dotIndex === index}
              onClick={() => goToIndex(dotIndex, { isLoop: false })}
            />
          ))}
        </span>
        <button
          type="button"
          onClick={() => {
            void toggleFullscreen();
          }}
          aria-label="Alternar tela cheia"
        >
          ⛶
        </button>
        {slides.length > 1 && (
          <span className={styles.next}>
            a seguir: {next.panel.title} · {String(Math.max(remaining, 0)).padStart(2, "0")}s
          </span>
        )}
      </div>
    </div>
  );
}
