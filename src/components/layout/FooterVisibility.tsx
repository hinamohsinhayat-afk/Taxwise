"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const HIDE_FOOTER_ON = ["/assistant"];

export function FooterVisibility() {
  const pathname = usePathname();
  if (HIDE_FOOTER_ON.some((p) => pathname?.startsWith(p))) return null;
  return <Footer />;
}
