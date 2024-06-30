import Image from "next/image";
import { GoogleSignInButton } from "@/components/authButtons";
import { redirect } from "next/navigation";
import { getCsrfToken } from "next-auth/react";

export default async function SignInPage() {
  // const session = await getServerSession(authConfig);
  // if (session) return redirect("/");

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center mt-10 p-10 shadow-md">
        <h1 className="mt-10 mb-4 text-4xl font-bold">Sign In</h1>
        <GoogleSignInButton />
      </div>
    </div>
  );
}
