"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@/components/ui/button";

export function PlaidLinkButton({ onLinked }: { onLinked: () => void }) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/plaid/create-link-token", { method: "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setLinkToken(data.link_token));
  }, []);

  const onSuccess = useCallback(
    async (public_token: string) => {
      setLoading(true);
      await fetch("/api/plaid/exchange-token", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ public_token }),
      });
      await fetch("/api/plaid/sync", { method: "POST" });
      setLoading(false);
      onLinked();
    },
    [onLinked]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken ?? "",
    onSuccess,
  });

  return (
    <Button
      variant="secondary"
      className="w-full mt-2"
      disabled={!ready || !linkToken || loading}
      onClick={() => open()}
    >
      {loading ? "Syncing..." : "Link a real bank or investment account"}
    </Button>
  );
}
