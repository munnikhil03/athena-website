import { PIN_LEGEND, PIN_ROLE_HEX, PIN_ROLE_LABEL, type PinRole } from "@/lib/map/pin-colors";

export function MapLegend({ roles = PIN_LEGEND }: { roles?: PinRole[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
      {roles.map((role) => (
        <li key={role} className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-full border border-black/10"
            style={{ backgroundColor: PIN_ROLE_HEX[role] }}
            aria-hidden="true"
          />
          {PIN_ROLE_LABEL[role]}
        </li>
      ))}
    </ul>
  );
}
