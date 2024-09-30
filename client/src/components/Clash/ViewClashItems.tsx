"use client";
import socket from "@/lib/socket";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import CountUp from "react-CountUp";

export default function ViewClashItems({ clash }: { clash: ClashTypes }) {
  const [clashComments, setClashComments] = useState(clash.ClashComment);
  const [clashItems, setClashItems] = useState(clash.ClashItem);
  useEffect(() => {
    socket.on(`clashing-${clash.id}`, (data) => {
      updateCounter(data.clashItemId);
    });

    socket.on(`clashing_comment-${clash.id}`, (data) => {
      updateComment(data);
    });
  });

  const updateComment = (data: any) => {
    if (clashComments && clashComments.length > 0) {
      setClashComments([...clashComments, data]);
    } else {
      setClashComments([data]);
    }
  };

  const updateCounter = (id: number) => {
    const items = [...clashItems];
    const findIndex = clashItems.findIndex((item) => item.id === id);
    if (findIndex !== -1) {
      items[findIndex].count += 1;
    }
    setClashItems(items);
  };

  return (
    <div className="mt-10">
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-center">
        {clashItems &&
          clashItems.length > 0 &&
          clashItems.map((item, index) => {
            return (
              <Fragment key={index}>
                <div className="w-full lg:w-[500] flex justify-center items-center flex-col">
                  <div className="w-full flex justify-center items-center rounded-md  p-2 h-[300px]">
                    <Image
                      src={getImageUrl(item.image)}
                      width={500}
                      height={500}
                      alt="preview_1"
                      className="w-full h-[300px] object-contain "
                    />
                  </div>
                  <CountUp
                    start={0}
                    end={item.count}
                    duration={1}
                    className=" mt-3 text-3xl font-extrabold bg-gradient-to-r from-[#c21500] to-[#ffc500]  bg-clip-text text-transparent"
                  />
                </div>
                {/* VS block */}
                {index % 2 == 0 ? (
                  <div className="w-full lg:w-auto flex justify-center items-center flex-col">
                    <div className="w-full flex justify-center items-center rounded-md border-1 border-dashed p-2 h-[300px]">
                      <h1 className="text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-[#c21500] to-[#ffc500] text-transparent bg-clip-text text-center">
                        VS
                      </h1>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </Fragment>
            );
          })}
      </div>

      {/* comments */}

      <div className="mt-4">
        {clashComments &&
          clashComments.length > 0 &&
          clashComments.map((item, index) => {
            return (
              <div
                key={index}
                className="flex flex-wrap lg:flex-nowrap justify-between items-center"
              >
                <p className="font-bold">{item.comment}</p>
                <p>{new Date(item.created_at).toDateString()}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
