-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationToken" TEXT,
ALTER COLUMN "status" SET DEFAULT 'pending';
