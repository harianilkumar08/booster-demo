"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/track";

/** Logs a page_view event (with any ?src= value) on every route change. */
export function PageView() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/mockups")) return;
    track("page_view");
  }, [pathname]);
  return null;
}
