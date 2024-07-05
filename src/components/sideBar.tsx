"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    title: 'Upload',
  },
  {
    href: '/dashboard/invoices',
    title: 'Invoice',
  },
];

const SideBar: React.FC<SideBarProps> = ({ show, setter }) => {
  const router = useRouter();
  const [active, setActive] = useState("Homepage");

  useEffect(() => {
    // Set the active menu item based on the current path
    const currentPath = window.location.pathname; // Use window.location.pathname to get the current path
    const currentItem = menuItems.find(item => item.href === currentPath);
    if (currentItem) {
      setActive(currentItem.title);
    }
  }, []);

  return (
    <aside className='flex items-center justify-between p-4 border-b border-gray-700'>
      <nav>
        <ul>
          {menuItems.map(({ href, title }) => (
            <li  className='m-2' key={title}>
              <Link legacyBehavior href={href}>
                <a
                  className={`font-bold p-2 margin-md hover:bg-sky-500 hover:cursor-pointer hover:text-black hover:rounded ${active === title ? 'bg-sky-500 text-black rounded' : ''}`}
                  onClick={() => {
                    setActive(title);
                    setter(true);
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
