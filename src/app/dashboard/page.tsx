"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { useEffect, useState } from "react";
import SideBar from "@/components/sideBar";
import {SignOut} from "@/components/signOut";
import createAxiosInstance from "@/../lib/axiosInstance";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();
  var API = createAxiosInstance(session?.accessToken as string);




  //Logic to create user if is not registered
  useEffect(() => {

    API.get("/users")
    .then((res) => {
      console.log(res.data);
      var exist= false;
      res.data.forEach((user: any) => {
        if (user.email === session?.user?.email) 
          exist = true;
      })
      if(!exist){
        let data = { name: "", email: "" };
        if (session?.user) {
          data.name = session.user.name as string;
          data.email = session.user.email as string;
        }
        API.post("/users", {
          data,
        })
        .then((res) => {
          if (res.status === 201)
            console.log("User created successfully");
        })
        .catch((e) => {
          console.error(e);
        });
      }
    })
  })

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
