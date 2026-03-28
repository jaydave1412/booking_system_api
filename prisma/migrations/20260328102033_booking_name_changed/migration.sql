/*
  Warnings:

  - You are about to drop the column `eventId` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `serviceId` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_eventId_fkey";

-- DropIndex
DROP INDEX "bookings_customerId_eventId_key";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "eventId",
ADD COLUMN     "serviceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
