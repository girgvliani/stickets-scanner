"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import type {
  QRCodeData,
  ScanResult,
  ScanResponse,
} from "@/types/scanner.types";
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
  const lastScannedRef = useRef<string | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScan = useCallback(
    async (detectedCodes: IDetectedBarcode[]) => {
      if (isProcessing || scanResult) return;

      const code = detectedCodes[0];
      if (!code?.rawValue) return;

      // Prevent scanning same QR twice in a row
      if (lastScannedRef.current === code.rawValue) return;
      lastScannedRef.current = code.rawValue;

      // Clear duplicate prevention after 3s
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
      cooldownRef.current = setTimeout(() => {
        lastScannedRef.current = null;
      }, 3000);

      let qrData: QRCodeData;
      try {
        qrData = JSON.parse(code.rawValue);
        if (!qrData.tokenId || !qrData.preimage) {
          throw new Error("Missing fields");
        }
      } catch {
        setScanResult({
          result: "invalid",
          reason: "Invalid QR code format",
        });
        return;
      }

      setIsProcessing(true);

      try {
        const response = await api.post("scan", {
          json: {
            tokenId: qrData.tokenId,
            preimage: qrData.preimage,
            version: qrData.version || 1,
          },
        });

        if (!response.ok) {
          const err = await response.json<{ message?: string }>();
          setScanResult({
            result: "invalid",
            reason: err.message || "Scan failed",
          });
          return;
        }

        const data = await response.json<ScanResponse>();
        setScanResult(data.data);

        // Auto-dismiss for automatic scan mode
        if (
          scanner?.scanMode === "automatic" &&
          data.data.result === "success"
        ) {
          setTimeout(() => setScanResult(null), 2000);
        }
      } catch {
        setScanResult({
          result: "invalid",
          reason: "Connection error. Please try again.",
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, scanResult, scanner?.scanMode]
  );

  const handleDismiss = useCallback(() => {
    setScanResult(null);
    lastScannedRef.current = null;
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
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
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
