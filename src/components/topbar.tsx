import { Bell, Search } from "lucide-react";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 md:px-8 py-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="h-9 w-9 rounded-lg border border-border bg-card flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
          <Search className="h-4 w-4" />
        </button>
        <button className="h-9 w-9 rounded-lg border border-border bg-card flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
          <Bell className="h-4 w-4" />
        </button>
        <div className="h-9 w-9 rounded-full bg-gold/90 flex items-center justify-center text-black text-sm font-mono font-semibold">
          EL
        </div>
      </div>
    </header>
  );
}
