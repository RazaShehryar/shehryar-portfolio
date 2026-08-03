import type { Metadata } from "next";
import { Contact } from "@/components/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch about product engineering work, coding agents or model evaluation.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <Contact />;
}
