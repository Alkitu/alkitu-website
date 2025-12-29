"use client";

import HeroPhones from "@/app/components/molecules/hero-phones";
import { useSearchParams } from "next/navigation";

export default function TestPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 p-10">
      <h1 className="text-3xl font-bold text-white mb-10">
        Hero Phones Component Test
      </h1>

      <div className="w-full max-w-lg border border-dashed border-zinc-700 p-4 rounded-xl flex items-center justify-center bg-zinc-900">
         <HeroPhones />
      </div>

      <p className="mt-10 text-zinc-500">
        Check animations and layout.
      </p>
    </div>
  );
}
