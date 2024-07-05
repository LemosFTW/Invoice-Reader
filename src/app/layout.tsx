import "./globals.css";
import { getServerSession } from "next-auth";
import { NextAuthProvider } from "@/components/SessionProvider";


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
          <main className="">{children}</main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
