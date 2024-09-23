import { PrismaClient } from "@prisma/client";
import { query } from "express";

const prisma = new PrismaClient({
    log:["error","query"],
    errorFormat:"pretty",
});

export default prisma;