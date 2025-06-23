import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { AuthProvider } from "./providers/AuthProvider";
import Navigation from "./components/Navigation";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "CGPA Calculator",
  description: "Track your academic journey with precision",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="antialiased">
        <AuthProvider session={session}>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
