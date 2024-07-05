"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { useEffect, useState } from "react";
import SideBar from "@/components/sideBar";
import {SignOut} from "@/components/SignOut";

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
    <>
      <div className="flex h-screen">
        <SideBar show={showSidebar} setter={setShowSidebar} />
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center space-x-3 justify-end p-4">
            <SignOut/>
          </div>
          <div className="flex flex-col items-center justify-center flex-grow">
            <h1 className="text-4xl font-bold p-3">
              Welcome {session?.user?.name}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
