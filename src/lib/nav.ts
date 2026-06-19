import {
  LayoutDashboard,
  Wallet,
  LineChart,
  Search,
  Newspaper,
  Sparkles,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Wealth", href: "/wealth", icon: Wallet },
  { label: "Investing", href: "/investing", icon: LineChart },
  { label: "Research", href: "/research", icon: Search },
  { label: "Markets", href: "/markets", icon: Newspaper },
  { label: "AI CFO", href: "/ai-cfo", icon: Sparkles },
  { label: "Settings", href: "/settings", icon: Settings },
];
