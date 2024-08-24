"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const {data:session} = useSession();
  return (
      <div className="mt-16">
        <h1>{JSON.stringify(session)}</h1>
      </div>
  );
}
