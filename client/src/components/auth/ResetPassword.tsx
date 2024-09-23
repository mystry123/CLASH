"use client";

import React, { useEffect } from "react";
import { SubmitButton } from "../common/SubmitBtn";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { resetPasswordAction } from "@/actions/authActions";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const initialState = {
    status: "",
    message: "",
    errors: {},
  };
  const router = useRouter();
  const [state, formAction] = useFormState(resetPasswordAction, initialState);

  useEffect(() => {
    if (state.status === 500) {
      toast.error(state.message);
    } else if (state.status === 200) {
      toast.success(state.message);
      router.push("/login");
    } else if (state.status === 400) {
      toast.error(state.message);
    }
  }, [state.status]);

  const params = useSearchParams();

  return (
    <div>
      <form action={formAction}>
        <div className="hidden">
          <Input
            id="email"
            type="hidden"
            name="email"
            value={params.get("email")!}
          />
        </div>
        <div className="hidden">
          <Input
            id="name"
            type="hidden"
            name="token"
            value={params.get("token")!}
          />
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
        </div>
        <div className="mt-4">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password..."
          />
          <span className="text-red-500">{state.errors?.confirmPassword}</span>
        </div>
        <div className="mt-4">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
