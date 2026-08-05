import { useCallback, useEffect, useRef } from "react";
import type { PanelConfig } from "../../config/schemas/panel.schema";

const CHANNEL_NAME = "pg-editor-preview";

export type PreviewChannelMessage =
  | { type: "draft"; draft: PanelConfig }
  | { type: "ready" }
  | { type: "preview-closed" };

type UsePreviewChannelOptions = {
  onMessage?: (message: PreviewChannelMessage) => void;
};

const isBroadcastChannelSupported = typeof BroadcastChannel !== "undefined";

/** Shares editor drafts across tabs so a detached preview stays in sync. */
export function usePreviewChannel({ onMessage }: UsePreviewChannelOptions = {}) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!isBroadcastChannelSupported) return;
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => onMessageRef.current?.(event.data as PreviewChannelMessage);
    channelRef.current = channel;
    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

  const postMessage = useCallback((message: PreviewChannelMessage) => {
    channelRef.current?.postMessage(message);
  }, []);

  return { postMessage, isSupported: isBroadcastChannelSupported };
}
