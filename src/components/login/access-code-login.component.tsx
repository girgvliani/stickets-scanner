"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import type { LoginResponse } from "@/types/scanner.types";
import Button from "@/components/ui/button";

const CODE_LENGTH = 8;

const AccessCodeLoginComponent = () => {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    []
  );

  const handleChange = (index: number, value: string) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);
    setError(null);

    // Auto-focus next input
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, CODE_LENGTH);

    const newCode = [...code];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);

    // Focus the next empty input or last filled
    const nextEmpty = newCode.findIndex((c) => !c);
    const focusIndex = nextEmpty === -1 ? CODE_LENGTH - 1 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const accessCode =
      code.slice(0, 4).join("") + "-" + code.slice(4).join("");

    if (accessCode.replace("-", "").length !== CODE_LENGTH) {
      setError("Please enter the full access code");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("auth/access-code", {
        json: { accessCode },
      });

      if (!response.ok) {
        const err = await response.json<{ message?: string }>();
        setError(err.message || "Invalid access code");
        setIsSubmitting(false);
        return;
      }

      const result = await response.json<LoginResponse>();
      login(result.data.token, result.data.scanner);
      router.push("/scan");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
      <p className="text-center text-sm text-text-secondary">
        Enter the 8-character access code provided by the event organizer
      </p>

      <div className="flex items-center gap-1.5">
        {code.map((char, i) => (
          <div key={i} className="flex items-center">
            <input
              ref={setInputRef(i)}
              type="text"
              inputMode="text"
              maxLength={1}
              value={char}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="h-12 w-10 rounded-lg border border-border bg-white text-center text-lg font-semibold text-text-primary outline-none transition-colors focus:border-primary"
            />
            {i === 3 && (
              <span className="mx-1 text-lg font-bold text-text-secondary">
                -
              </span>
            )}
          </div>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-error-light px-4 py-2.5 text-sm text-danger">
          {error}
        </p>
      )}

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full max-w-sm"
      >
        Connect
      </Button>
    </form>
  );
};

export default AccessCodeLoginComponent;
