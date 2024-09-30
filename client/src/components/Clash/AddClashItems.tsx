"use client";
import { Upload } from "lucide-react";
import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CLASH_ITEMS_URL } from "@/lib/apiEndPoint";

export default function AddClashItems({
  token,
  clashId,
}: {
  token: string;
  clashId: number;
}) {
  const [items, setItems] = useState<Array<ClashItemTypes>>([
    { image: null },
    { image: null },
  ]);
  const [urls, setUrls] = useState<Array<string>>(["", ""]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const imageRef1 = useRef<HTMLInputElement>(null);
  const imageRef2 = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setItems((prev) => {
        prev[index].image = file;
        return [...prev];
      });
      const imageURl = URL.createObjectURL(file);
      const updateUrls = [...urls];
      updateUrls[index] = imageURl;
      setUrls(updateUrls);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    items.forEach((item) => {
      if (item.image) {
        formData.append(`images[]`, item.image);
      }
    });
    formData.append("id", clashId.toString() || "");
    if (formData.get("images[]")) {
      setLoading(true);
      try {
        const { data } = await axios.post(CLASH_ITEMS_URL, formData, {
          headers: {
            Authorization: token,
          },
        });
        if (data?.message) {
          toast.success(data.message);
          setTimeout(() => {
            router.push(`/dashboard`);
          }, 1000);
        } else {
          toast.warning("Failed to add items");
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === 422) {
            if (error.response.data.errors) {
              error.response.data.errors.forEach((err: any) => {
                toast.error(err.message);
              });
            }
          }
        } else {
          toast.error("Failed to add items");
        }
      }
    }
  };

  return (
    <div className="mt-10">
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between">
        {/* first block */}
        <div
          className="w-full lg:w-[500] flex justify-center items-center flex-col"
          onClick={() => imageRef1.current?.click()}
        >
          <Input
            type="file"
            className="hidden"
            ref={imageRef1}
            onChange={(event) => {
              handleImageChange(0, event);
            }}
          />
          <div className="w-full flex justify-center items-center rounded-md border-2 border-dashed p-2 h-[300px]">
            {urls.length > 0 && urls?.[0] !== "" ? (
              <Image
                src={urls?.[0]}
                width={500}
                height={500}
                alt="preview_1"
                className="w-full h-[300px] object-contain "
              />
            ) : (
              <h1 className="flex space-x-2 items-center text-xl">
                <Upload /> <span>upload file</span>
              </h1>
            )}
          </div>
        </div>
        {/* VS block */}
        <div className="w-full lg:w-auto flex justify-center items-center flex-col">
          <div className="w-full flex justify-center items-center rounded-md border-1 border-dashed p-2 h-[300px]">
            <h1 className="text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-[#c21500] to-[#ffc500] text-transparent bg-clip-text text-center">
              VS
            </h1>
          </div>
        </div>
        {/* second block */}
        <div
          className="w-full lg:w-[500] flex justify-center items-center flex-col"
          onClick={() => imageRef2.current?.click()}
        >
          <Input
            type="file"
            className="hidden"
            ref={imageRef2}
            onChange={(event) => {
              handleImageChange(1, event);
            }}
          />
          <div className="w-full flex justify-center items-center rounded-md border-2 border-dashed p-2 h-[300px]">
            {urls.length > 0 && urls?.[1] !== "" ? (
              <Image
                src={urls?.[1]}
                width={500}
                height={500}
                alt="preview_1"
                className="w-full h-[300px] object-contain "
              />
            ) : (
              <h1 className="flex space-x-2 items-center text-xl">
                <Upload /> <span>upload file</span>
              </h1>
            )}
          </div>
        </div>
      </div>
      <div className="text-center mt-8">
        <Button className="w-52" onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
