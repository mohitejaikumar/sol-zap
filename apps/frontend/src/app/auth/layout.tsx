import { Toaster } from "../../components/ui/toaster";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg w-screen h-screen flex justify-center items-center">
        <div className=" opacity-100 p-4 rounded-lg shadow-lg">
            <div className=" w-[25vw] h-fit flex flex-col items-center gap-6 p-8 justify-between bg border-2 border-gray-400 rounded-xl">
            {children} <Toaster />
            </div>
        </div>
        </div>
    );
}