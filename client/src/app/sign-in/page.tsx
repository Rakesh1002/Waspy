import SignIn from "@/components/sign-in";
import { Container } from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <Container className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <Link href="/" className="inline-block mb-6">
            <Image
              src="/logo.svg"
              alt="WASPY"
              width={120}
              height={40}
              className="dark:invert mx-auto"
            />
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>
        <SignIn />
      </div>
    </Container>
  );
}
