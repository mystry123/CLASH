import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Clashing from "@/components/Clash/Clashing";
import { TAKKLE_URL } from "@/lib/apiEndPoint";
import { getServerSession } from "next-auth";
import React from "react";

export default async function ClashItem({
  params,
}: {
  params: { id: number };
}) {
  let data = await fetch(`${TAKKLE_URL}/${params.id}`, {
    cache: "no-cache",
  });
  if (!data.ok) {
    throw new Error("failed to fetch data");
  }

  let res = await data.json();
  let clash: ClashTypes = res?.data[0];

  const session = await getServerSession(authOptions);

  return (
    <div className="container m-auto">
      <div className="mt-4">
        <h1 className="text-2xl lg:text-4xl font-extrabold">{clash.title}</h1>
        <p>{clash.description}</p>
      </div>
      {clash && <Clashing clash={clash} />}
    </div>
  );
}
