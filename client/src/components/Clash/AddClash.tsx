"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import axios, { AxiosError } from "axios";
import { TAKKLE_URL } from "@/lib/apiEndPoint";
import {
  CustomSession,
  CustomUser,
} from "@/app/api/auth/[...nextauth]/options";
import { toast } from "sonner";
import { clearCache } from "@/actions/commonActions";

export default function AddClash({ user }: { user: CustomUser }) {
  const [open, setOpen] = useState(false);
  const [clashData, setClashData] = useState<ClashFormTypes>({});
  const [date, setDate] = React.useState<Date | null>();
  const [image, setImage] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = useState<ClashFormTypesError>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", clashData.title || "");
      formData.append("description", clashData.description || "");
      formData.append("expire_at", date?.toISOString() || "");
      if (image) {
        formData.append("image", image);
      }
      const { data } = await axios.post(TAKKLE_URL, formData, {
        headers: {
          Authorization: user.token,
        },
      });
      setLoading(false);
      if (data?.message) {
        clearCache("dashboard");
        setClashData({});
        setDate(null);
        setImage(null);
        toast.success("Takkle created Successfully");
        setOpen(false);
        setErrors({});
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          setErrors(error.response?.data?.errors);
        }
      } else {
        toast.error("Something went wrong please try again!");
      }
    }
  };

  useEffect(() => {
    if (!open) {
      setClashData({});
      setDate(null);
      setImage(null);
      setErrors({});
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Clash</Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create Takkle</DialogTitle>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={clashData?.title || ""}
                onChange={(e) => {
                  setClashData({ ...clashData, title: e.target.value });
                }}
                className={errors?.title ? "border-red-500" : ""}
                placeholder="Enter your title here.."
              />
              <span className="text-red-500">{errors?.title}</span>
            </div>
            <div className="mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={clashData?.description || ""}
                onChange={(e: any) => {
                  setClashData({ ...clashData, description: e.target.value });
                }}
                className={errors?.description ? "border-red-500" : ""}
                placeholder="Enter your title here.."
              />
              <span className="text-red-500">{errors?.description}</span>
            </div>
            <div className="mt-4">
              <Label htmlFor="Image">Image</Label>
              <Input
                id="title"
                type="file"
                onChange={handleImageChange}
                placeholder="Enter your File here.."
              />
              <span className="text-red-500">{errors?.image}</span>
            </div>
            <div className="mt-4">
              <Label htmlFor="Expire_at" className="block">
                Expire_at
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full mt-1 justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                      errors?.description ? "border-red-500" : ""
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date || new Date()}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <span className="text-red-500">{errors?.expire_at}</span>
            </div>
            <div className="mt-4 w-full">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "creating..." : "Create Takkle"}
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
