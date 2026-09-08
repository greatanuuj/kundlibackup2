import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kundli Analyzer Pro — Vedic Astrology Software" },
      {
        name: "description",
        content:
          "Professional Vedic kundli software: birth chart, grahas, dashas, yogas, doshas and authentic remedies.",
      },
      { name: "author", content: "Kundli Analyzer Pro" },
      { property: "og:title", content: "Kundli Analyzer Pro — Vedic Astrology Software" },
      {
        property: "og:description",
        content: "Birth chart, dasha timeline, doshas and remedies computed with real astronomy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Karla:wght@400;500;600&family=Tiro+Devanagari+Hindi&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <ClerkProvider
      publishableKey={
        typeof window === "undefined"
          ? import.meta.env["VITE_CLERK_PUBLISHABLE_KEY"]
          : publishableKeyFromHost(
              window.location.hostname,
              import.meta.env["VITE_CLERK_PUBLISHABLE_KEY"],
            )
      }
      appearance={{
        options: {
          logoPlacement: "inside",
          logoLinkUrl: basePath || "/",
          logoImageUrl:
            typeof window === "undefined"
              ? `${basePath || ""}/logo.svg`
              : `${window.location.origin}${basePath}/logo.svg`,
        },
        variables: {
          colorPrimary: "oklch(0.45 0.18 285)",
          colorBackground: "oklch(0.99 0.008 75)",
          colorForeground: "oklch(0.22 0.03 285)",
          fontFamily: "Karla, sans-serif",
          borderRadius: "0.625rem",
        },
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to save and open your Kundli",
          },
        },
        signUp: {
          start: {
            title: "Create your Kundli account",
            subtitle: "Save your birth details for next time",
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
