"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlaidLink } from "react-plaid-link";

export default function PlaidOAuthPage() {
  const router = useRouter();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [status, setStatus] = useState("Completing connection...");

  useEffect(() => {
    setLinkToken(sessionStorage.getItem("plaid_link_token"));
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken ?? "",
    receivedRedirectUri: typeof window !== "undefined" ? window.location.href : undefined,
    onSuccess: async (public_token) => {
      setStatus("Linking your account...");
      await fetch("/api/plaid/exchange-token", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ public_token }),
      });
      await fetch("/api/plaid/sync", { method: "POST" });
      sessionStorage.removeItem("plaid_link_token");
      router.replace("/wealth");
    },
    onExit: () => {
      sessionStorage.removeItem("plaid_link_token");
      router.replace("/wealth");
    },
  });

  useEffect(() => {
    if (ready && linkToken) open();
  }, [ready, linkToken, open]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-text-secondary">
      <p>{status}</p>
    </div>
  );
}
