"use client";

type Primitive = string | number | boolean | null | undefined;

export type AnalyticsPayload = Record<string, Primitive | Primitive[]>;

export type AnalyticsEventName =
  | "home_action_click"
  | "home_info_alert_seen"
  | "templates_loaded"
  | "template_play_clicked"
  | "template_edit_clicked"
  | "template_delete_confirmed"
  | "templates_import_success"
  | "templates_import_error"
  | "templates_export"
  | "templates_predefined_open"
  | "templates_predefined_added"
  | "template_form_started"
  | "template_validation_failed"
  | "template_save_success"
  | "template_save_error"
  | "template_unsaved_exit"
  | "play_template_selected"
  | "play_game_recovered"
  | "play_timer_toggled"
  | "play_level_changed"
  | "play_jump_to_level"
  | "play_player_update"
  | "play_entry_update"
  | "play_addon_update"
  | "play_punctuality_bonus"
  | "play_reset"
  | "play_error"
  | "history_loaded"
  | "history_filter_applied"
  | "history_export_success"
  | "history_export_error"
  | "history_import_success"
  | "history_import_error"
  | "history_view_details"
  | "history_delete_tournament"
  | "history_clear_all";

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: AnalyticsPayload) => void;
    };
  }
}

const isClient = typeof window !== "undefined";

export function trackEvent(
  name: AnalyticsEventName,
  payload?: AnalyticsPayload
) {
  if (!isClient) return;

  try {
    window.umami?.track(name, sanitizePayload(payload));
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics] error tracking", name, error);
    }
  }
}

function sanitizePayload(
  payload?: AnalyticsPayload
): AnalyticsPayload | undefined {
  if (!payload) return undefined;

  const sanitized: AnalyticsPayload = {};

  for (const [key, value] of Object.entries(payload)) {
    const safeValue = sanitizeValue(value);
    if (safeValue !== undefined) {
      sanitized[key] = safeValue;
    }
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

function sanitizeValue(
  value: Primitive | Primitive[] | unknown
): Primitive | Primitive[] | undefined {
  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeValue(item))
      .filter((item) => item !== undefined) as Primitive[];
  }

  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  return undefined;
}
