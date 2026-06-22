import Image from "next/image";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <Image src="/logo-full-light-text.png" alt="Locke Capital AI" width={1536} height={1024} className="h-24 w-auto" priority />
      <SignUp />
    </div>
  );
}
