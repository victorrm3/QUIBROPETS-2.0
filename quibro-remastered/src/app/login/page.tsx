import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginBackground } from "@/components/auth/LoginBackground";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-[calc(100vh-53.89px)] flex-1 items-center justify-center overflow-hidden bg-black px-4 py-12">
      <LoginBackground />

      <div className="relative z-10 w-full max-w-md">
        <Suspense
          fallback={
            <div className="h-80 w-full border border-white/15 bg-black/55" />
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
