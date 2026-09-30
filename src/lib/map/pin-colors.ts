// Central place for the map's color-as-information system (see DESIGN.md
// "Map pin color semantics"). Keep this in sync with the `--urgent`,
// `--accent`, `--primary`, `--found`, and `--clue` tokens in globals.css -
// the hex values below are the resolved colors of those same tokens, used
// here because Leaflet's divIcon HTML can't reference CSS variables reliably
// across the icon's own shadow-free inline SVG.

export type PinRole = "lost" | "sighting" | "found" | "reunited" | "clue";

export const PIN_ROLE_HEX: Record<PinRole, string> = {
  lost: "#C94C4C",
  sighting: "#E5A93D",
  found: "#176B6B",
  reunited: "#3D7A57",
  clue: "#7B5EA7",
};

export const PIN_ROLE_LABEL: Record<PinRole, string> = {
  lost: "Lost",
  sighting: "Sighting",
  found: "Found / owner unknown",
  reunited: "Reunited",
  clue: "Clue / bedding location",
};

export const PIN_LEGEND: PinRole[] = ["lost", "sighting", "found", "reunited", "clue"];

/** Color role for a case pin on the global map, from its type + status. */
export function caseToPinRole(type: string, status: string): PinRole {
  if (status === "resolved") return "reunited";
  if (type === "lost") return "lost";
  if (type === "seen") return "sighting";
  return "found"; // "found" and "help" cases both read as the teal "found" role
}

/** Color role for a case_event pin on a single case's own timeline map. */
export function eventToPinRole(eventType: string): PinRole {
  switch (eventType) {
    case "tracks_clues":
    case "bedding":
      return "clue";
    case "found_contained":
      return "found";
    case "possible_sighting":
    case "confirmed_sighting":
      return "sighting";
    case "last_known":
      return "lost";
    default:
      return "clue";
  }
}
