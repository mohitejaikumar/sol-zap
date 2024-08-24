"use client";

import { RecoilRoot } from "recoil";

export default function Providers({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    
    return (
        <div>
            <RecoilRoot>
                {children}
            </RecoilRoot>
        </div>
    );
}   