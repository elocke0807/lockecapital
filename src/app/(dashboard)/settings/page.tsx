import { Topbar } from "@/components/topbar";
import { ProfileCard } from "@/components/profile-card";
import { ConnectedAccountsCard } from "@/components/connected-accounts-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" subtitle="Manage your profile, accounts, and preferences." />
      <div className="p-6 md:p-8 space-y-6 max-w-2xl">
        <ProfileCard />
        <ConnectedAccountsCard />

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Theme</span>
              <span>Dark (Premium)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Currency</span>
              <span>USD</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Notifications</span>
              <Badge variant="neutral">Coming soon</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
