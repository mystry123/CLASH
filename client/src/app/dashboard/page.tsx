import AddClash from "@/components/takkle/AddClash";
import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { TAKKLE_URL } from "@/lib/apiEndPoint";
import TakkleCard from "@/components/takkle/takkleCard";
export default async function dashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);
  let data = await fetch(TAKKLE_URL, {
    headers: {
      Authorization: session?.user?.token!,
    },
    next: {
      revalidate: 60 * 60,
      tags: ["dashboard"],
    },
  });
  if (!data.ok) {
    throw new Error("failed to fetch data");
  }
  let res = await data.json();

  let takkles: Array<ClashTypes> = [];
  if (res?.data) takkles = res?.data;

  return (
    <div className="container mx-auto">
      <div className="text-end mt-10">
        <AddClash user={session?.user!} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 ">
        {takkles.length > 0 ? (
          takkles.map((takkle) => <TakkleCard key={takkle.id} clash={takkle} token = {session?.user?.token!}/>)
        ) : (
          <div className="w-full text-center mt-10">
            <h1 className="text-2xl font-bold">No Takkle Found</h1>
          </div>
        )}
      </div>
    </div>
  );
}
