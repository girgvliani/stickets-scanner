"use client";

import { cn } from "@/lib/cn";
import { useAuthStore } from "@/stores/auth.store";
import type { ScanMode } from "@/types/scanner.types";

const MODES: { value: ScanMode; label: string; description: string }[] = [
  {
    value: "internal",
    label: "Internal",
    description: "Manual dismiss after each scan",
  },
  {
    value: "silent",
    label: "Silent",
    description: "No sound feedback on scan",
  },
  {
    value: "automatic",
    label: "Automatic",
    description: "Auto-dismiss successful scans",
  },
];

const ScanModeToggleComponent = () => {
  const scanMode = useAuthStore((s) => s.scanner?.scanMode);
  const updateScanMode = useAuthStore((s) => s.updateScanMode);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-primary">Scan Mode</h3>
      <div className="space-y-2">
        {MODES.map((mode) => (
          <button
            key={mode.value}
            onClick={() => updateScanMode(mode.value)}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
              scanMode === mode.value
                ? "border-primary bg-primary/5"
                : "border-border bg-white"
            )}
          >
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border-2",
                scanMode === mode.value
                  ? "border-primary"
                  : "border-border"
              )}
            >
              {scanMode === mode.value && (
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                {mode.label}
              </p>
              <p className="text-xs text-text-secondary">
                {mode.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScanModeToggleComponent;
