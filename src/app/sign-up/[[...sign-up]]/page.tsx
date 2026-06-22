import Image from "next/image";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <Image src="/logo-full.svg" alt="Locke Capital AI" width={200} height={52} className="h-12 w-auto" priority />
      <SignUp />
    </div>
  );
}
