"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { useEffect, useState } from "react";
import SideBar from "@/components/sideBar";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-2">
      <SideBar setter={setShowSidebar} show={showSidebar} />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          router.push("/api/auth/signout");
        }}
      >
        Sign Out
      </button>
    </div>
  );
}