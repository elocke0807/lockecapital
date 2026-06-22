import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      style={{ backgroundColor: "#0c0c0c" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(212,175,55,0.08), transparent 60%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/logo-full.png"
          alt="Locke Capital AI"
          width={1254}
          height={1254}
          quality={100}
          className="mb-10 h-56 w-56 md:h-72 md:w-72 drop-shadow-[0_0_60px_rgba(212,175,55,0.18)]"
          priority
        />
        <h1
          className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold tracking-tight text-text-primary max-w-3xl leading-tight"
        >
          The AI-powered financial operating system for wealth builders.
        </h1>
        <div className="mt-6 h-px w-16 bg-gold/40" />
        <p className="mt-6 text-text-secondary text-base md:text-lg max-w-xl leading-relaxed">
          Cash flow, budgeting, goals, net worth, investing, and a private AI CFO — all in one place.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="px-8">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="px-8">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
