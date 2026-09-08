import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "@/components/auth/ClerkAuthPages";

export const Route = createFileRoute("/sign-in/$")({
  component: SignInPage,
});