import "./globals.css";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";

import { NextAuthProvider } from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Invoice App",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={""}>
        <NextAuthProvider session={session}>
          <main className="mx-auto max-w-5xl">{children}</main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
