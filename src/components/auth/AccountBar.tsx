import { useClerk, useUser } from "@clerk/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function AccountBar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return <div className="h-9 w-24 animate-pulse rounded-md bg-secondary" aria-hidden="true" />;
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/sign-in">Log in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/sign-up">Create account</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <span className="hidden text-sm text-muted-foreground sm:inline">
        {user.firstName || user.primaryEmailAddress?.emailAddress || "Your account"}
      </span>
      <Button variant="outline" size="sm" onClick={() => void signOut()}>
        Log out
      </Button>
    </div>
  );
}