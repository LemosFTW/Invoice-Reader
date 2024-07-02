"use client";
import { useSession } from "next-auth/react";
import { GoogleSignInButton } from "@/components/authButtons";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignInPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      let data = {name: "", email: ""};

      if (session.user) {
        data.name = session.user.name as string;
        data.email = session.user.email as string;
      }

      axios.post("http://localhost:8000/users", {
        data,
      }).then((res) => { console.log(res.status); console.log(res.data); })
        .catch((e) => { console.error(e); })
      
      
      ;
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center mt-10 p-10 shadow-md">
        <h1 className="mt-10 mb-4 text-4xl font-bold">Sign In</h1>
        <GoogleSignInButton />
      </div>
    </div>
  );
}
