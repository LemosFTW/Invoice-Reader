"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { Sidebar } from "flowbite-react";


interface SideBarProps {
  show: boolean;
  setter: (value: boolean) => void;
}

const menuItems = [
  {
    href: '/',
    title: 'Homepage',
  },
  {
    href: '/dashboard/upload',
    title: 'Upload ',
  },
  {
    href: '/dashboard/invoices',
    title: 'Invoice ',
  },
];

const SideBar: React.FC<SideBarProps> = ({ show, setter }) => {
  const router = useRouter();
  const [active, setActive] = useState("");

  return (
    <aside className='flex items-center justify-between p-4 border-b border-gray-700'>
  <nav>
    <ul>
      {menuItems.map(({ href, title }) => (
        <li className='m-2' key={title}>
          <Link legacyBehavior href={href}>
            <a
              className={`font-bold p-2 margin-md hover:bg-sky-500 hover:cursor-pointer hover:text-black hover:rounded`}
              onClick={() => {
                setActive(title);
                setter(false);
              }}
            >
              {title}
            </a>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
</aside>
  );
};

export default SideBar;
