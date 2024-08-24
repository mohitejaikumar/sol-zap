import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
    const router = useRouter();
    const session = useSession();
    return (
        <div className=" flex fixed w-full p-6 justify-between items-center">
        <div className=" basis-1/2 text-4xl font-bold">
            SolZap
        </div>
        <div className=" basis-1/2 text-white text-xl flex items-center justify-end gap-12 px-6">
            {session?.data ? (
            <>
                <button
                onClick={() =>
                    signOut({ callbackUrl: `${window.location.origin}/` })
                }
                >
                Logout
                </button>
                <button
                onClick={() => router.push("/chat")}
                className=" bg-white rounded-3xl hover:bg-gray-300 transition-all duration-300 ease-in-out px-4 py-2 text-black"
                >
                Dashboard
                </button>
            </>
            ) : (
            <>
                <button
                className=" hover:bg-white rounded-3xl transition-all duration-300 ease-in-out px-6 py-2 hover:text-black"
                onClick={() => router.push("/auth/login")}
                >
                Login
                </button>
                <button
                onClick={() => router.push("/auth/signup")}
                className=" bg-white rounded-3xl hover:bg-gray-300 transition-all duration-300 ease-in-out px-6 py-2 text-black"
                >
                Sign Up
                </button>
            </>
            )}
        </div>
        </div>
    );
};

export default Navbar;