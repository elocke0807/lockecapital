"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background-secondary pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch overflow-x-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 min-w-[64px] flex-col items-center justify-center gap-1 py-2.5 text-[10px]",
                active ? "text-gold" : "text-text-secondary"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
