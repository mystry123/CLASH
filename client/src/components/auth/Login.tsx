"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SubmitButton } from "../common/SubmitBtn";
import { loginAction } from "@/actions/authActions";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export default function Login() {
  const initialState = {
    status: "",
    message: "",
    errors: {},
    data: {},
  };

  const [state, formAction] = useFormState(loginAction, initialState);

  useEffect(() => {
    if (state.status === 500) {
      toast.error("Internal server error");
    } else if (state.status === 404) {
      console.log(state);
      toast.error("User not found");
    } else if (state.status === 200) {
      toast.success("Login Successfull");
      signIn("credentials", {
        email: state.data?.email,
        password: state.data?.password,
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } else if (state.status === 400) {
      toast.error("Invalid Credentials");
    }
  }, [state]);

  return (
    <form action={formAction}>
      <div className="mt-4">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email..."
        />
        <span className="text-red-500">{state.errors?.email}</span>
      </div>
      <div className="mt-4">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Enter your password..."
        />
        <span className="text-red-500">{state.errors?.password}</span>
        <div className="text-right">
          <Link
            href="/forget-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
      <div className="mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
