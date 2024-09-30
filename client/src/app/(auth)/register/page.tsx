import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Register from "@/components/auth/Register";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[550px] bg-white rounded-xl px-10 py-5 shadow-md">
        <h1
          className="text-4xl font-extrabold bg-gradient-to-r
         from-[#c21500] to-[#ffc500] text-transparent bg-clip-text text-center"
        >
          Signup
        </h1>
        <Register />
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
