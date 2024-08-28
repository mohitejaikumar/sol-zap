"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
    const router = useRouter();
    const session = useSession();
    return (
        <div className=" flex fixed top-3 right-0 w-full px-5 justify-between items-center">
        <div className=" basis-1/2 text-4xl font-bold cursor-pointer" onClick={() => router.push("/")}>
            SolZap
        </div>
        <div className=" basis-1/2 text-white text-xl flex items-center justify-end gap-12 px-6">
            {session?.data ? (
            <>  
                <button
                    className="bg-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-300 ease-in-out px-4 py-2  text-lg text-black"
                    onClick={() =>
                        router.push("/allZaps")
                    }
                >
                My Zaps
                </button>
                <button
                    className="bg-black rounded-sm hover:bg-gray-800 transition-all duration-300 ease-in-out px-6 py-2 text-lg text-white"
                    onClick={() =>
                        signOut({ callbackUrl: `${window.location.origin}/` })
                    }
                >
                Logout
                </button>
            </>
            ) : (
            <>
                <button
                className=" bg-black rounded-sm hover:bg-gray-800 transition-all duration-300 ease-in-out px-6 py-2 text-lg text-white"
                onClick={() => router.push("/auth/signin")}
                >
                Sign In
                </button>
                <button
                onClick={() => router.push("/auth/signup")}
                className=" bg-black rounded-sm hover:bg-gray-800 transition-all duration-300 ease-in-out px-6 py-2 text-lg text-white"
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