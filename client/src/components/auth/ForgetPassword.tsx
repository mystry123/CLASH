"use client";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "../common/SubmitBtn";
import { forgotPasswordAction } from "@/actions/authActions";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgetPassword() {
  const initialState = {
    status: "",
    message: "",
    errors: {},
  };

  const [state, formAction] = useFormState(forgotPasswordAction, initialState);

  const router = useRouter();

  useEffect(() => {
    if (state.status === 500) {
      toast.error("Internal server error");
    } else if (state.status === 404) {
      console.log(state);
      toast.error(state.message);
    } else if (state.status === 200) {
      toast.success("Login Successfull");
      router.push("/");
    } else if (state.status === 400) {
      toast.error("Invalid Credentials");
    }
  }, [state, router]);

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
        <SubmitButton />
      </div>
    </form>
  );
}
