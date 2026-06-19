import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" subtitle="Manage your profile, accounts, and preferences." />
      <div className="p-6 md:p-8 space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Field label="Full Name" value="Ethan Locke" />
            <Field label="Email" value="elocke0807@gmail.com" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Chase Checking", "Fidelity Brokerage", "Coinbase"].map((acc) => (
              <div key={acc} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <span className="text-sm">{acc}</span>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            ))}
            <Button variant="secondary" className="w-full mt-2">
              + Connect a new account
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-text-secondary">
            <p>Theme: Dark (Premium)</p>
            <p>Currency: USD</p>
            <p>Notifications: Email + Push</p>
          </CardContent>
        </Card>
      </div>
    </>
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
