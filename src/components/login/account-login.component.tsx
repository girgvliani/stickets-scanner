"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import type { LoginResponse } from "@/types/scanner.types";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

interface AccountFormData {
  username: string;
  password: string;
}

const AccountLoginComponent = () => {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AccountFormData>();

  const onSubmit = async (data: AccountFormData) => {
    setError(null);

    try {
      const response = await api.post("auth/login", { json: data });

      if (!response.ok) {
        const err = await response.json<{ message?: string }>();
        setError(err.message || "Invalid credentials");
        return;
      }

      const result = await response.json<LoginResponse>();
      login(result.data.token, result.data.scanner);
      router.push("/scan");
    } catch {
      setError("Connection error. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Username"
        placeholder="Enter username"
        autoCapitalize="none"
        autoCorrect="off"
        {...register("username", { required: true })}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        {...register("password", { required: true })}
      />

      {error && (
        <p className="rounded-lg bg-error-light px-4 py-2.5 text-sm text-danger">
          {error}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        Sign In
      </Button>
    </form>
  );
};

export default AccountLoginComponent;
