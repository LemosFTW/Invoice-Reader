"use client";

import { useRouter } from "next/navigation"; // Certifique-se de importar de "next/navigation"
import { signOut } from "next-auth/react";

export function SignOut() {
    const router = useRouter();

    return (
    <>
        <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
            signOut().then(() => {
            router.push("/"); // Redirecionar para a página inicial após o sign out
            });
        }}
        >
        Sign Out
        </button>
    </>
    );
}
