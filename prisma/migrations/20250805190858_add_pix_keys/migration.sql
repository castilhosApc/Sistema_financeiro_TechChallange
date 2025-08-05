-- AlterTable
ALTER TABLE "contacts" ADD COLUMN "pixKey" TEXT;
ALTER TABLE "contacts" ADD COLUMN "pixKeyType" TEXT;

-- CreateIndex
CREATE INDEX "contacts_pixKey_idx" ON "contacts"("pixKey");
