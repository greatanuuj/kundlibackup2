import { createFileRoute } from "@tanstack/react-router";
import { SignUpPage } from "@/components/auth/ClerkAuthPages";

export const Route = createFileRoute("/sign-up/$")({
  component: SignUpPage,
});