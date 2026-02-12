"use client";

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRightLeft,
} from "lucide-react";
import type { ScanResult } from "@/types/scanner.types";
import { cn } from "@/lib/cn";

interface ScanResultProps {
  result: ScanResult;
  onDismiss: () => void;
}

const ScanResultComponent = ({ result, onDismiss }: ScanResultProps) => {
  return (
    <div
      className="absolute inset-0 z-30 flex items-end justify-center p-4 pb-12"
      onClick={onDismiss}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 transition-colors",
          result.result === "success" && "bg-success/20",
          result.result === "already_used" && "bg-warning/20",
          result.result === "wrong_scanner" && "bg-wrong/20",
          result.result === "invalid" && "bg-error/20"
        )}
      />

      {/* Result Card */}
      <div
        className={cn(
          "relative w-full max-w-sm rounded-2xl border-2 bg-white p-5 shadow-xl animate-in slide-in-from-bottom-4 duration-300",
          result.result === "success" && "border-success",
          result.result === "already_used" && "border-warning",
          result.result === "wrong_scanner" && "border-wrong",
          result.result === "invalid" && "border-error"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon + Status */}
        <div className="mb-3 flex items-center gap-3">
          <ResultIcon result={result.result} />
          <div>
            <h3 className="text-lg font-bold text-text-primary">
              <ResultTitle result={result.result} />
            </h3>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          {result.result === "success" && (
            <>
              <DetailRow label="Name" value={result.ownerName} />
              <DetailRow label="Ticket" value={result.ticketTypeName} />
              <DetailRow label="Section" value={String(result.section)} />
              {result.seat && (
                <DetailRow label="Seat" value={result.seat} />
              )}
            </>
          )}

          {result.result === "already_used" && (
            <>
              <DetailRow label="Name" value={result.ownerName} />
              <DetailRow
                label="First scanned"
                value={formatTime(result.firstScannedAt)}
              />
            </>
          )}

          {result.result === "wrong_scanner" && (
            <>
              <DetailRow label="Ticket" value={result.ticketTypeName} />
              <p className="mt-2 text-sm text-text-secondary">
                This ticket is assigned to a different entrance.
              </p>
            </>
          )}

          {result.result === "invalid" && (
            <p className="text-sm text-text-secondary">{result.reason}</p>
          )}
        </div>

        {/* Tap to dismiss */}
        <button
          onClick={onDismiss}
          className="mt-4 w-full rounded-xl bg-background-light py-2.5 text-sm font-medium text-text-secondary transition-colors active:bg-border"
        >
          Tap to scan next
        </button>
      </div>
    </div>
  );
};

function ResultIcon({ result }: { result: ScanResult["result"] }) {
  const iconClass = "h-8 w-8";
  switch (result) {
    case "success":
      return <CheckCircle2 className={cn(iconClass, "text-success")} />;
    case "already_used":
      return <AlertTriangle className={cn(iconClass, "text-warning")} />;
    case "wrong_scanner":
      return <ArrowRightLeft className={cn(iconClass, "text-wrong")} />;
    case "invalid":
      return <XCircle className={cn(iconClass, "text-error")} />;
  }
}

function ResultTitle({ result }: { result: ScanResult["result"] }) {
  switch (result) {
    case "success":
      return "Valid Ticket";
    case "already_used":
      return "Already Used";
    case "wrong_scanner":
      return "Wrong Entrance";
    case "invalid":
      return "Invalid Ticket";
  }
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-medium text-text-primary">{value}</span>
    </div>
  );
}

function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export default ScanResultComponent;
