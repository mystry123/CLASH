
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Login from "@/components/auth/Login";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";


export default async function  page() {
  const session = await getServerSession(authOptions);

  if(session){  
    redirect("/dashboard");
  }
  
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[550px] bg-white rounded-xl px-10 py-5 shadow-md">
        <h1 className="text-3xl font-bold mt-2 bg-gradient-to-r from-[#c21500] to-[#ffc500] text-transparent bg-clip-text text-center">
          Login
        </h1>
        <Login/>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
