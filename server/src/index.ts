import express, { Application, Request, Response } from "express";
import "dotenv/config";
import path from "path";
import ejs from "ejs";
import cors from "cors";
import Routes from "./routes/index";
import fileUpload from "express-fileupload";
import { appLimiter } from "./config/rateLimit";
import { Server } from "socket.io";
import { setupSocket } from "./socket";
import helmet from "helmet";
import { createServer, Server as HttpServer } from "http";

const app: Application = express();
const server: HttpServer = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_APP_URL,
  },
});

export { io };
setupSocket(io);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(appLimiter);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(express.static("public"));
// set view engine
app.set("view engine", "ejs");
// set views directory
app.set("views", path.join(__dirname, "views"));

// routes
app.use(Routes);

app.get("/", async (req: Request, res: Response) => {
  const html = await ejs.renderFile(
    path.join(__dirname, "views", "emails", "welcome.ejs"),
    { name: "John Doe" }
  );
  emailQueue.add("sendEmail", {
    email: "ritikp153@Gmail.com",
    subject: "Welcome to our platform",
    body: html,
  });

  return res.render("emails/welcome", { name: "John Doe" });
});

app.get("/home", (req: Request, res: Response) => {
  res.render("welcome");
});

// jobs

import "./jobs/index";
import { emailQueue } from "./jobs/emailJobs";
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
