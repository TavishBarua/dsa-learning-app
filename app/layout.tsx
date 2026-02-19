import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSA Learning App",
  description: "Master Data Structures and Algorithms",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DSA Learning",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {/* Cloudflare Web Analytics */}
        <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "6135e70374314d90b9a778020f58af52"}'></script>
      </body>
    </html>
  );
}
