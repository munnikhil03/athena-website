export const EVENT_TYPE_LABEL: Record<string, string> = {
  last_known: "Last known location",
  possible_sighting: "Possible sighting",
  confirmed_sighting: "Confirmed sighting",
  tracks_clues: "Tracks / clue found",
  bedding: "Bedding site found",
  food_trap_station: "Food / trap station set",
  accident_origin: "Accident origin",
  found_contained: "Found & contained",
  update: "Update",
  note: "Note",
};

// The subset of event types selectable from the public "Add an update"
// form. "last_known" is reserved for what a LOST report captures at
// creation time, and "accident_origin" / "food_trap_station" are more
// specialized than a general community update needs right now.
export const UPDATE_EVENT_TYPES = [
  "possible_sighting",
  "confirmed_sighting",
  "tracks_clues",
  "bedding",
  "found_contained",
  "update",
  "note",
] as const;
