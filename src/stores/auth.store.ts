"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ScannerPayload } from "@/types/scanner.types";

interface AuthState {
  token: string | null;
  scanner: ScannerPayload | null;
  accessCode: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (token: string, scanner: ScannerPayload, accessCode?: string) => void;
  logout: () => void;
  updateScanMode: (scanMode: ScannerPayload["scanMode"]) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  token: null,
  scanner: null,
  accessCode: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        login: (token, scanner, accessCode) =>
          set({
            token,
            scanner,
            accessCode: accessCode ?? null,
            isAuthenticated: true,
          }),

        logout: () => set(initialState),

        updateScanMode: (scanMode) =>
          set((state) => ({
            scanner: state.scanner
              ? { ...state.scanner, scanMode }
              : null,
          })),
      }),
      {
        name: "scanner-auth",
      }
    ),
    {
      name: "AuthStore",
      enabled: process.env.NODE_ENV !== "production",
    }
  )
);
