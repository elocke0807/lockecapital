import Image from "next/image";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <Image src="/logo-full.png" alt="Locke Capital AI" width={1254} height={1254} className="h-32 w-32" priority />
      <SignIn />
    </div>
  );
}
