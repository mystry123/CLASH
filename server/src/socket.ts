import { Server } from "socket.io";
import { votingQueue, votingQueueName } from "./jobs/VotingJobs";
import { commentQueue, commentQueueName } from "./jobs/commentJobs";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("New connection", socket.id);
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    //event listen

    socket.onAny(async (event, data) => {
      if(event.startsWith("clashing-")) {
        await votingQueue.add(votingQueueName, data);
        socket.broadcast.emit(`clashing-${data.clashId}`, data);
      } else if(event.startsWith("clashing_comment-")) {
        await commentQueue.add(commentQueueName, data);
        socket.broadcast.emit(`clashing_comment-${data.id}`, data);
      }
    } 
  });
};
