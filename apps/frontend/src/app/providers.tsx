"use client";

import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

export default function Providers({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    
    return (
        <div>
            <SessionProvider>
                <RecoilRoot>
                    {children}
                </RecoilRoot>
            </SessionProvider>
        </div>
    );
}   