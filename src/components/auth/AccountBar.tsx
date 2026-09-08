import { useClerk, useUser } from "@clerk/react";
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
          <a href="/sign-in">Log in</a>
        </Button>
        <Button size="sm" asChild>
          <a href="/sign-up">Create account</a>
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