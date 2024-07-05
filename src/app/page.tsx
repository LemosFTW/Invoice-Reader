"use client";
import { useSession } from "next-auth/react";
import { GoogleSignInButton } from "@/components/authButtons";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import createAxiosInstance from "@/../lib/axiosInstance";
import { toast,ToastContainer } from "react-toastify";

export default function SignInPage() {
  const { data: session } = useSession();
  const router = useRouter();

  var API = createAxiosInstance(session?.accessToken as string);

  useEffect(() => {
    if (session) {
      let data = { name: "", email: "" };

      if (session.user) {
        data.name = session.user.name as string;
        data.email = session.user.email as string;
      }

      API.post("/users", {
        data,
      })
        .then((res) => {
          if (res.status === 201)
            toast.success("User created successfully");
          
        })

        .catch((e) => {
          console.error(e);
        });
        router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-2 bg-gray-900">
  <div className="flex flex-col items-center">
    <h1 className="mt-10 mb-4 text-6xl font-extrabold text-white tracking-wide">Invoice APP</h1>
  </div>
  <div className="flex flex-col items-center mt-10 p-7 shadow-md bg-white rounded-lg">
    <h1 className="mt-10 mb-4 text-4xl font-bold text-gray-900">Sign In</h1>
    <GoogleSignInButton />
    <ToastContainer />
  </div>
</div>
  );
}
