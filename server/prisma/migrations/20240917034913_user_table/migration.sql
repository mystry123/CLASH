-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "password_reset_token" TEXT,
    "token_sent_at" TIMESTAMP(3),
    "email_verified_at" TIMESTAMP(3),
    "email_verify_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
