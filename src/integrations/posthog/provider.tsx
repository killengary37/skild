import posthog from "posthog-js";
import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY as string, {
      api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string,
      capture_pageview: false,
      capture_pageleave: true,
    });
  }, []);

  const location = useRouterState({ select: (s) => s.location });

  useEffect(() => {
    posthog.capture("$pageview");
  }, [location.href]);

  return <>{children}</>;
}
