import Cookies from "js-cookie";
import { AuthResponse, User } from "./types";

export function saveAuth(auth: AuthResponse) {
  Cookies.set("token", auth.token, { expires: 1 });
  Cookies.set("user", JSON.stringify({
    id: auth.id, email: auth.email, fullName: auth.fullName,
    role: auth.role, points: auth.points,
  }), { expires: 1 });
}

export function getUser(): User | null {
  const raw = Cookies.get("user");
  if (!raw) return null;
  try { return JSON.parse(raw) as User; } catch { return null; }
}

export function logout() {
  Cookies.remove("token");
  Cookies.remove("user");
  window.location.href = "/login";
}

export function isAuthenticated(): boolean {
  return !!Cookies.get("token");
}
