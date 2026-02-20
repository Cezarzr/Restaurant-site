import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Local Lebanese - Live Schedule & Bookings",
  description: "Modern Lebanese food truck schedule, menus, and booking requests.",
  openGraph: {
    title: "The Local Lebanese",
    description: "Live calendar, menus, and bookings",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="container flex items-center justify-between py-4">
            <Link href="/" className="text-xl font-bold text-brand">The Local Lebanese</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/schedule">Schedule</Link>
              <Link href="/menus">Menus</Link>
              <Link href="/book">Book Us</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/admin" className="font-medium">Admin</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
