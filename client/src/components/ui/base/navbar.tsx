"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/common/UserAvatar";
import LogoutModal from "@/components/auth/LogoutModal";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <LogoutModal open={open} setOpen={setOpen} />
      <div className="container mx-auto flex justify-between items-center mt-2">
        <div className="text-white text-lg font-bold">
          <Link href="/">
            <Image
              src="/banner_img.svg"
              width={50}
              height={50}
              alt="bannner image"
            />
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <UserAvatar />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setOpen(true);
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
