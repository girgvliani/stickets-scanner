"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { api } from "@/lib/api";
import { HTTPError } from "ky";
import { useAuthStore } from "@/stores/auth.store";
import type {
  ScanResult,
  ScanResponse,
} from "@/types/scanner.types";
import Spinner from "@/components/ui/spinner";
import ScanResultComponent from "./scan-result.component";
import ScannerHeaderComponent from "./scanner-header.component";

const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner),
  { ssr: false }
);

const CameraScannerComponent = () => {
  const scanner = useAuthStore((s) => s.scanner);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = useCallback(
    async (detectedCodes: IDetectedBarcode[]) => {
      if (isProcessing || scanResult) return;

      const code = detectedCodes[0];
      if (!code?.rawValue) return;

      setIsProcessing(true);

      try {
        const response = await api.post("scan", {
          json: { payload: code.rawValue },
        });

        const data = await response.json<ScanResponse>();
        setScanResult(data.data);

        // Auto-dismiss for automatic scan mode
        if (
          scanner?.scanMode === "automatic" &&
          data.data.result === "success"
        ) {
          setTimeout(() => setScanResult(null), 2000);
        }
      } catch (err) {
        if (err instanceof HTTPError) {
          try {
            const body = await err.response.json<{ error?: { message?: string }; message?: string }>();
            const reason = body?.error?.message ?? body?.message ?? "Invalid ticket";
            setScanResult({ result: "invalid", reason });
          } catch {
            setScanResult({ result: "invalid", reason: "Invalid ticket" });
          }
        } else {
          setScanResult({
            result: "invalid",
            reason: "Connection error. Please try again.",
          });
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, scanResult, scanner?.scanMode]
  );

  const handleDismiss = useCallback(() => {
    setScanResult(null);
  }, []);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      <ScannerHeaderComponent />

      {/* Camera View */}
      <Scanner
        onScan={handleScan}
        onError={(error) => console.error("Scanner error:", error)}
        formats={["qr_code"]}
        sound
        components={{
          torch: true,
          finder: true,
        }}
        styles={{
          container: {
            width: "100%",
            height: "100%",
          },
          video: {
            width: "100%",
            height: "100%",
            objectFit: "cover" as const,
          },
        }}
        paused={!!scanResult}
      />

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
          <Spinner className="h-12 w-12 text-white" />
        </div>
      )}

      {/* Result Overlay */}
      {scanResult && (
        <ScanResultComponent result={scanResult} onDismiss={handleDismiss} />
      )}
    </div>
  );
};

export default CameraScannerComponent;
