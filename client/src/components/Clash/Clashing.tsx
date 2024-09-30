"use client";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";
import React, { Fragment, useState, useEffect } from "react";
import CountUp from "react-CountUp";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ThumbsUp } from "lucide-react";
import socket from "@/lib/socket";
import { toast } from "sonner";

export default function Clashing({ clash }: { clash: ClashTypes }) {
  const [clashComments, setClashComments] = useState(clash.ClashComment);
  const [clashItems, setClashItems] = useState(clash.ClashItem);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [hideVote, setHideVote] = useState(false);

  useEffect(() => {
    socket.on(`clashing-${clash.id}`, (data) => {
      updateCounter(data.clashItemId);
    });
    socket.on(`clashing_comment-${clash.id}`, (data) => {
      updateComment(data);
    });
  });

  const handleVote = async (id: number) => {
    if (clashItems && clashItems.length > 0) {
      setLoading(true);
      setHideVote(true);
      updateCounter(id);

      // socket emit

      socket.emit(`clashing-${clash.id}`, {
        clashId: clash.id,
        clashItemId: id,
      });
      setLoading(false);
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

  const handleComment = (event: React.FormEvent) => {
    event.preventDefault();
    if (comment.length > 2) {
      setLoadingComment(true);
      const payload = {
        comment,
        created_at: new Date().toDateString(),
        id: clash.id,
      };
      updateComment(payload);
      socket.emit(`clashing_comment-${clash.id}`, payload);
      setComment("");
      setLoadingComment(false);
    } else {
      toast.warning("Comment should be more than 2 characters");
    }
  };
  const updateComment = (data: any) => {
    if (clashComments && clashComments.length > 0) {
      setClashComments([...clashComments, data]);
    } else {
      setClashComments([data]);
    }
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
                  {hideVote ? (
                    <CountUp
                      start={0}
                      end={item.count}
                      duration={1}
                      className=" mt-3 text-3xl font-extrabold bg-gradient-to-r from-[#c21500] to-[#ffc500]  bg-clip-text text-transparent"
                    />
                  ) : (
                    <Button
                      className=" mr-2 mt-4 text-lg"
                      onClick={() => handleVote(item.id)}
                      disabled={loading}
                    >
                      <span>Vote</span> <ThumbsUp />
                    </Button>
                  )}
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

      <form onSubmit={handleComment} className="mt-4 w-full">
        <Textarea
          placeholder="Type your suggestions 🙂"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
        <Button className="w-full mt-2" disabled={loadingComment}>
          {" "}
          Submit
        </Button>
      </form>

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
