import {
  ClipboardCheck,
  FileCheck2,
  LayoutDashboard,
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { normalizeRoleName } from "@/config/roles.config";

export type AppRoleKey =
  | "super-admin"
  | "manager"
  | "admin"
  | "front-officer"
  | "back-officer"
  | "agent"
  | "customer";

export type DashboardDefinition = {
  key: AppRoleKey;
  roleName: string;
  title: string;
  subtitle: string;
  route: string;
  icon: LucideIcon;
};

export const roleHome: Record<AppRoleKey, string> = {
  "super-admin": "/dashboard",
  manager: "/dashboard",
  admin: "/dashboard",
  "front-officer": "/dashboard",
  "back-officer": "/dashboard",
  agent: "/dashboard",
  customer: "/dashboard",
};

export const dashboardConfig: Record<AppRoleKey, DashboardDefinition> = {
  "super-admin": {
    key: "super-admin",
    roleName: "Super Admin",
    title: "Super Admin Dashboard",
    subtitle: "System-wide user, role, permission, location, report, and audit control.",
    route: roleHome["super-admin"],
    icon: ShieldCheck,
  },
  manager: {
    key: "manager",
    roleName: "Manager",
    title: "Manager Dashboard",
    subtitle: "Location-scoped operations, approvals, applications, and reports.",
    route: roleHome.manager,
    icon: Users,
  },
  admin: {
    key: "admin",
    roleName: "Admin",
    title: "Admin Dashboard",
    subtitle: "Location-scoped user, service, workflow, and report management.",
    route: roleHome.admin,
    icon: LayoutDashboard,
  },
  "front-officer": {
    key: "front-officer",
    roleName: "Front Officer",
    title: "Front Officer Dashboard",
    subtitle: "Receive applications, verify documents, and forward requests.",
    route: roleHome["front-officer"],
    icon: ClipboardCheck,
  },
  "back-officer": {
    key: "back-officer",
    roleName: "Back Officer",
    title: "Back Officer Dashboard",
    subtitle: "Review applications, approve, reject, return, or complete tasks.",
    route: roleHome["back-officer"],
    icon: FileCheck2,
  },
  agent: {
    key: "agent",
    roleName: "Agent",
    title: "Agent Dashboard",
    subtitle: "Location-scoped tasks assigned to you.",
    route: roleHome.agent,
    icon: UserCog,
  },
  customer: {
    key: "customer",
    roleName: "Customer",
    title: "Customer Dashboard",
    subtitle: "Submit applications, track status, receive notifications, and download documents.",
    route: roleHome.customer,
    icon: UserCheck,
  },
};

export const dashboardList = Object.values(dashboardConfig);

/**
 * Maps a raw role string to a dashboard key.
 *
 * IMPORTANT: an unrecognized role must NOT fall back to "super-admin" —
 * that would hand any user with an unmapped role string the Super Admin
 * dashboard and its system-wide controls. We fail closed to "customer"
 * (the least-privileged dashboard) instead.
 */
export function normalizeRole(role?: string | null): AppRoleKey {
  const normalized = normalizeRoleName(role);

  const map: Record<string, AppRoleKey> = {
    super_admin: "super-admin",
    manager: "manager",
    admin: "admin",
    front_officer: "front-officer",
    back_officer: "back-officer",
    agent: "agent",
    customer: "customer",
  };

  return map[normalized] ?? "customer";
}

export function getDashboardForRole(role?: string | null) {
  return dashboardConfig[normalizeRole(role)];
}
