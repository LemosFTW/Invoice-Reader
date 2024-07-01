"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SideBar({ show, setter }: { show: any; setter: any }) {
  const router = useRouter();
  const [active, setActive] = useState("");

  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <button onClick={() => setter(false)} className="text-2xl">
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="p-4">
        <ul>
          <li className={ ' font-bold p-2 margin-md hover:bg-sky-500 hover:cursor-pointer hover:text-black hover:rounded'}>
          
            <Link legacyBehavior href="/dashboard/upload">
              <a>Upload a new Invoice</a>
            </Link>
          </li>
          <li className={ ' font-bold p-2 margin-md hover:bg-sky-500 hover:cursor-pointer hover:text-black hover:rounded'}>
            <Link legacyBehavior href="/dashboard/invoices">
              <a>View Invoices</a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
