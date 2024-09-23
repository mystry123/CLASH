"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { Button } from "../ui/button";
import TakkleCardMenu from "./TakkleCardMenu";

export default function TakkleCard({ clash , token }: { clash: ClashTypes }) {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center flex-row">
        <CardTitle>{clash.title}</CardTitle>
        <TakkleCardMenu takkle={clash} />
      </CardHeader>
      <CardContent className="h-[300px]">
        {clash.image && (
          <Image
            src={getImageUrl(clash.image)}
            alt={clash.title}
            width={500}
            height={500}
            className="rounded-md w-full h-[220px] object-contain"
          />
        )}
        <p>
          <strong>Expire At:</strong>
          {new Date(clash.expire_at).toDateString()}
        </p>
        <p>{clash.description}</p>
      </CardContent>
      <CardFooter>
        <Button>Items </Button>
      </CardFooter>
    </Card>
  );
}
