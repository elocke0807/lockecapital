"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="hidden md:flex h-screen w-60 flex-col border-r border-border bg-background-secondary sticky top-0">
      <div className="flex items-center gap-2 px-6 py-6">
        <Image src="/logo-mark-light.png" alt="" width={1024} height={1024} className="h-10 w-10 rounded-md" />
        <span className="text-base font-semibold tracking-tight">Locke Capital</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-card text-text-primary border border-border"
                  : "text-text-secondary hover:text-text-primary hover:bg-card/60"
              )}
            >
              <Icon className={cn("h-4 w-4", active && "text-gold")} strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-3">
          <UserButton />
          <div className="min-w-0">
            <p className="text-xs text-text-secondary">Signed in as</p>
            <p className="text-sm font-medium truncate">
              {user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "..."}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
