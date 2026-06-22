"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProfileCard() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Field label="Full Name" value={user?.fullName ?? "..."} />
        <Field label="Email" value={user?.primaryEmailAddress?.emailAddress ?? "..."} />
        <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => openUserProfile()}>
          Manage Account
        </Button>
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
