"use client";
import React, { Suspense } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import dynamic from "next/dynamic";
import Env from "@/lib/env";
import { toast } from "sonner";
const EditClash = dynamic(() => import("./EditClash"));
const DeleteClash = dynamic(() => import("./DeleteClash"));

export default function TakkleCardMenu({
  takkle,
  token,
}: {
  takkle: ClashTypes;
  token: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${Env.APP_URL}/clash/${takkle.id}`);
    toast.success("Link copied to clipboard");
  };
  return (
    <>
      {open && (
        <Suspense fallback={<div>Loading...</div>}>
          <EditClash
            clash={takkle}
            open={open}
            setOpen={setOpen}
            token={token}
          />
        </Suspense>
      )}
      {deleteOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <DeleteClash
            open={deleteOpen}
            setOpen={setDeleteOpen}
            id={takkle.id}
            token={token}
          />
        </Suspense>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical size={24} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopy}>Copy Link</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setDeleteOpen(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
