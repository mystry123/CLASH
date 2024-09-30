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
import Link from "next/link";

export default function TakkleCard({
  clash,
  token,
}: {
  clash: ClashTypes;
  token: string;
}) {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center flex-row">
        <CardTitle>{clash.title}</CardTitle>
        <TakkleCardMenu takkle={clash} token={token} />
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
          {new Date(clash.expires_at).toDateString()}
        </p>
        <p>{clash.description}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/clash/items/${clash.id}`}>
          <Button>Items </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
