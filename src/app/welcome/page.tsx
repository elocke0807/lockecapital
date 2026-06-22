import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <Image
        src="/logo-full.png"
        alt="Locke Capital AI"
        width={1254}
        height={1254}
        className="mb-8 h-40 w-40 md:h-48 md:w-48"
        priority
      />
      <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-text-primary max-w-2xl">
        The AI-powered financial operating system for wealth builders.
      </h1>
      <p className="mt-4 text-text-secondary text-base md:text-lg max-w-xl">
        Cash flow, budgeting, goals, net worth, investing, and a private AI CFO — all in one place.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/sign-up">Get Started</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
