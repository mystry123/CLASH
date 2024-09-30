import React from "react";
import HeroSection from "@/components/ui/base/HeroSection";
import { getServerSession } from "next-auth"; 
import { authOptions } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  return (
    <div>
      <HeroSection />
    </div>
  );
}
