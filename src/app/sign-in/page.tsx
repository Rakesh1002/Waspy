import SignIn from "@/components/sign-in";
import { Container } from "@/components/ui/container";

export default function SignInPage() {
  return (
    <Container className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>
        <SignIn />
      </div>
    </Container>
  );
} 