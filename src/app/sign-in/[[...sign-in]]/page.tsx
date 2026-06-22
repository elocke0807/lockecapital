import Image from "next/image";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background py-10">
      <Image src="/logo-mark-light.png" alt="Locke Capital AI" width={1024} height={1024} className="h-20 w-20" priority />
      <SignIn />
    </div>
  );
}
