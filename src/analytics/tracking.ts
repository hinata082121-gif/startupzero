type TrackingPayload = Record<string, unknown>;

const emit = (eventName: string, payload: TrackingPayload) => {
  if (import.meta.env.DEV) {
    console.debug(`[tracking] ${eventName}`, payload);
  }
};

export const trackGameStart = (payload: TrackingPayload) => emit("game_start", payload);

export const trackActionSelected = (payload: TrackingPayload) =>
  emit("action_selected", payload);

export const trackGameOver = (payload: TrackingPayload) => emit("game_over", payload);

export const trackVictory = (payload: TrackingPayload) => emit("victory", payload);

export const trackLanguageChanged = (payload: TrackingPayload) =>
  emit("language_changed", payload);
