export type LocationLevel = "city" | "subcity" | "woreda" | "";

export type AppRoleName =
  | "super_admin"
  | "manager"
  | "admin"
  | "back_officer"
  | "front_officer"
  | "agent"
  | "customer";

export type RoleOption = {
  name: AppRoleName;
  label: string;
  isScoped: boolean;
};

export const LOCATION_LEVELS: Array<{ value: Exclude<LocationLevel, "">; label: string }> = [
  { value: "city", label: "City Level" },
  { value: "subcity", label: "Subcity Level" },
  { value: "woreda", label: "Woreda Level" },
];

export const ROLE_OPTIONS: RoleOption[] = [
  { name: "super_admin", label: "Super Admin", isScoped: false },
  { name: "manager", label: "Manager", isScoped: true },
  { name: "admin", label: "Admin", isScoped: true },
  { name: "back_officer", label: "Back Officer", isScoped: true },
  { name: "front_officer", label: "Front Officer", isScoped: true },
  { name: "agent", label: "Agent", isScoped: true },
  { name: "customer", label: "Customer", isScoped: false },
];

/**
 * Normalizes a raw role string (from the backend, storage, or a <select>)
 * into one of our known AppRoleName values — or "" if it's blank / unrecognized.
 *
 * IMPORTANT: unrecognized role strings must NOT silently resolve to
 * "super_admin". Doing so would fail *open* — a role name we don't
 * recognize would be treated as the most privileged, unscoped role in
 * the UI (skipping location requirements, unlocking every menu, etc).
 * Instead we fail *closed*: unknown input returns "" and callers decide
 * a safe, low-privilege default from there.
 */
export function normalizeRoleName(role?: string | null): AppRoleName | "" {
  const value = String(role ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_")
    .trim();

  if (!value) return "";

  if (value === "super" || value === "superadmin" || value === "super_admin") return "super_admin";
  if (value === "manager" || value === "managemer") return "manager";
  if (value === "admin" || value === "administrator") return "admin";

  if (
    value === "city_manager" ||
    value === "subcity_manager" ||
    value === "woreda_manager"
  ) return "manager";

  if (
    value === "city_admin" ||
    value === "subcity_admin" ||
    value === "woreda_admin"
  ) return "admin";

  if (
    value === "back" ||
    value === "backofficer" ||
    value === "back_officer" ||
    value === "city_back_officer" ||
    value === "subcity_back_officer" ||
    value === "woreda_back_officer"
  ) return "back_officer";

  if (
    value === "front" ||
    value === "frontofficer" ||
    value === "front_officer" ||
    value === "city_front_officer" ||
    value === "subcity_front_officer" ||
    value === "woreda_front_officer"
  ) return "front_officer";

  if (value === "agent") return "agent";

  if (value === "customer") return "customer";

  // Unrecognized role name — return "" rather than guessing.
  return "";
}

/**
 * Looks up the RoleOption for a role name. If the role is blank or not
 * recognized, returns a safe, scoped-by-default placeholder rather than
 * silently granting Super Admin's unscoped behavior.
 */
export function getRoleOption(role?: string | null): RoleOption {
  const normalized = normalizeRoleName(role);

  const match = ROLE_OPTIONS.find((item) => item.name === normalized);
  if (match) return match;

  // No match: if nothing was supplied yet (role not chosen), stay neutral.
  // If something WAS supplied but we don't recognize it, default to
  // "scoped" so location fields are still required rather than skipped.
  return {
    name: (normalized || "customer") as AppRoleName,
    label: role ? String(role) : "",
    isScoped: Boolean(normalized),
  };
}


export function roleLabel(role?: string | null) {
  return getRoleOption(role).label;
}

export function locationLevelFromIds(cityId?: unknown, subcityId?: unknown, woredaId?: unknown): LocationLevel {
  if (woredaId) return "woreda";
  if (subcityId) return "subcity";
  if (cityId) return "city";
  return "";
}

export function locationLevelLabel(level?: string | null) {
  return LOCATION_LEVELS.find((item) => item.value === level)?.label ?? "";
}