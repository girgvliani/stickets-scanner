"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Syncs auth token from Zustand (localStorage) to a cookie
 * so Next.js middleware can read it for route protection.
 */
export function AuthSync() {
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) {
      document.cookie = `scanner-token=${token}; path=/; SameSite=Lax`;
    } else {
      document.cookie =
        "scanner-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, [token]);

  return null;
}
