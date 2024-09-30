import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { signOut } from "next-auth/react";
import { TAKKLE_URL } from "@/lib/apiEndPoint";
import axios from "axios";
import { clearCache } from "@/actions/commonActions";

export default function DeleteClash({
  open,
  setOpen,
  id,
  token,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  token: string;
}) {
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`${TAKKLE_URL}/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      if (data?.message) {
        setOpen(false);
        clearCache("dashboard");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Delete?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this clash?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel> Cancel</AlertDialogCancel>
          <AlertDialogAction
            style={{ backgroundColor: "red" }}
            onClick={handleDelete}
          >
            <span className="bg-gradient-to-r from-[#c21500] to-[#ffc500] text-transparent bg-clip-text text-center">
              Logout
            </span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
