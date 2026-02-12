"use client";

import { ArrowLeft, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import Button from "@/components/ui/button";
import ScanModeToggleComponent from "./scan-mode-toggle.component";

const SettingsPanelComponent = () => {
  const router = useRouter();
  const scanner = useAuthStore((s) => s.scanner);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-dvh bg-background-light">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-3 shadow-sm">
        <button
          onClick={() => router.push("/scan")}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors active:bg-background-light"
        >
          <ArrowLeft className="h-5 w-5 text-text-primary" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">Settings</h1>
      </header>

      <div className="space-y-4 p-4">
        {/* Scanner Info */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            Scanner Info
          </h3>
          <div className="space-y-2">
            <InfoRow label="Name" value={scanner?.scannerName || "—"} />
            <InfoRow label="Event" value={`#${scanner?.eventId || "—"}`} />
            <InfoRow
              label="Access"
              value={
                scanner?.accessMethod === "account"
                  ? "Account Login"
                  : "Access Code"
              }
            />
            <InfoRow
              label="Ticket Types"
              value={
                scanner?.allowedTicketTypeIds?.length
                  ? scanner.allowedTicketTypeIds.join(", ")
                  : "All"
              }
            />
          </div>
        </div>

        {/* Scan Mode */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <ScanModeToggleComponent />
        </div>

        {/* Logout */}
        <Button
          variant="secondary"
          onClick={handleLogout}
          className="w-full text-danger"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-medium text-text-primary">{value}</span>
    </div>
  );
}

export default SettingsPanelComponent;
