"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import AccountLoginComponent from "./account-login.component";
import AccessCodeLoginComponent from "./access-code-login.component";

type LoginTab = "account" | "access_code";

const LoginTabsComponent = () => {
  const [activeTab, setActiveTab] = useState<LoginTab>("access_code");

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo / Title */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text-primary">
            Stickets Scanner
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to start scanning tickets
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mb-6 flex rounded-xl bg-background-light p-1">
          <button
            onClick={() => setActiveTab("account")}
            className={cn(
              "flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors",
              activeTab === "account"
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-secondary"
            )}
          >
            Account Login
          </button>
          <button
            onClick={() => setActiveTab("access_code")}
            className={cn(
              "flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors",
              activeTab === "access_code"
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-secondary"
            )}
          >
            Access Code
          </button>
        </div>

        {/* Forms */}
        {activeTab === "account" ? (
          <AccountLoginComponent />
        ) : (
          <AccessCodeLoginComponent />
        )}
      </div>
    </div>
  );
};

export default LoginTabsComponent;
