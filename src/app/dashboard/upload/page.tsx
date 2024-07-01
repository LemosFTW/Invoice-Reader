"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { useEffect, useState } from "react";
import SideBar from "@/components/sideBar";

export default function upload() {
  const [file, setFile] = useState<File>();

  const { data: session, status } = useSession();
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      const data = new FormData();
      data.set("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <>
      <div>

        <h1 
        className=" text-4xl font-bold p-5 mx-12 text-center"
        >Upload a new Invoice</h1>
      </div>

      <form
        onSubmit={onSubmit}
        className="h-screen flex items-center justify-center "
      >
        <input
          type="file"
          name="file"
          onChange={(e) => setFile(e.target.files?.[0])}
          className=" border-2 border-gray-300 border-dashed rounded-md p-4 w-96 "
          draggable="true"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
          }}
        />
        
        <input type="submit" value="Upload" 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-12 py-2 px-4 rounded"/>
        
      </form>
    </>
  );
}
