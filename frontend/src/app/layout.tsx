import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import { PortfolioAPI } from "@/services/api";

export const dynamic = 'force-dynamic';

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const res = await PortfolioAPI.getProfile();
  const name = res.success && res.data?.name ? res.data.name : "Karanraj";
  const headline = res.success && res.data?.headline ? res.data.headline : "Cyber Security Specialist";
  return {
    title: `${name} | Cyber Security Portfolio`,
    description: `${name} - ${headline} | Information Security & Defense Portfolio`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profileRes = await PortfolioAPI.getProfile();
  const profileName = profileRes.success && profileRes.data ? profileRes.data.name : "Karanraj";
  
  const navbarRes = await PortfolioAPI.getNavbarSettings();
  const navbarSettings = navbarRes.success && navbarRes.data ? navbarRes.data : null;

  return (
    <html lang="en" className={`${outfit.variable} scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans">
        <Navbar settings={navbarSettings} />
        {children}
      </body>
    </html>
  );
}
