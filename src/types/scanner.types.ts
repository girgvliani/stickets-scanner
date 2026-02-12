// Scanner JWT payload (mirrors backend ScannerJwtPayload)
export interface ScannerPayload {
  scannerId: string;
  eventId: string;
  scannerName: string;
  allowedTicketTypeIds: number[];
  scanMode: ScanMode;
  accessMethod: AccessMethod;
}

export type ScanMode = "internal" | "silent" | "automatic";
export type AccessMethod = "account" | "access_code";

// Auth responses
export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    scanner: ScannerPayload;
  };
}

export interface ValidateResponse {
  success: boolean;
  data: ScannerPayload;
}

// Scan request/response
export interface ScanRequest {
  tokenId: string;
  preimage: string;
  version: number;
}

export type ScanResultType =
  | "success"
  | "already_used"
  | "wrong_scanner"
  | "invalid";

export interface ScanSuccessResult {
  result: "success";
  ticketTokenId: string;
  ownerName: string;
  ticketTypeName: string;
  section: number;
  seat: string | null;
}

export interface ScanAlreadyUsedResult {
  result: "already_used";
  ticketTokenId: string;
  ownerName: string;
  firstScannedAt: string;
}

export interface ScanWrongScannerResult {
  result: "wrong_scanner";
  ticketTokenId: string;
  ticketTypeName: string;
  allowedTicketTypeIds: number[];
}

export interface ScanInvalidResult {
  result: "invalid";
  reason: string;
}

export type ScanResult =
  | ScanSuccessResult
  | ScanAlreadyUsedResult
  | ScanWrongScannerResult
  | ScanInvalidResult;

export interface ScanResponse {
  success: boolean;
  data: ScanResult;
}

// QR code data format
export interface QRCodeData {
  tokenId: string;
  preimage: string;
  version: number;
}
