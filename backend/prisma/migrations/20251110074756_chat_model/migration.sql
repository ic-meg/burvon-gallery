-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "email" TEXT,
ADD COLUMN     "is_read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "session_id" TEXT;

-- CreateTable
CREATE TABLE "ChatSession" (
    "session_id" TEXT NOT NULL,
    "email" TEXT,
    "user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_active" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("session_id")
);

-- CreateIndex
CREATE INDEX "ChatSession_email_idx" ON "ChatSession"("email");

-- CreateIndex
CREATE INDEX "ChatSession_user_id_idx" ON "ChatSession"("user_id");

-- CreateIndex
CREATE INDEX "ChatMessage_session_id_idx" ON "ChatMessage"("session_id");

-- CreateIndex
CREATE INDEX "ChatMessage_email_idx" ON "ChatMessage"("email");

-- CreateIndex
CREATE INDEX "ChatMessage_user_id_idx" ON "ChatMessage"("user_id");

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "ChatSession"("session_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserAccount"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
