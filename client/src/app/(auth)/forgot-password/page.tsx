import ForgetPassword from "@/components/auth/ForgetPassword";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[550px] bg-white rounded-xl px-10 py-5 shadow-md">
        <h1 className="text-3xl font-bold mt-2 bg-gradient-to-r from-[#c21500] to-[#ffc500] text-transparent bg-clip-text text-center">
          Forget Password?
        </h1>
        <ForgetPassword />
        <p className="mt-4 text-center">
          Go to{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
