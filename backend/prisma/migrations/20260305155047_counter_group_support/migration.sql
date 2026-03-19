/*
  Warnings:

  - A unique constraint covering the columns `[hospital_group_id,counter_type]` on the table `hospital_counters` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "hospital_counters" ADD COLUMN     "hospital_group_id" INTEGER,
ALTER COLUMN "hospital_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "uq_counter_group" ON "hospital_counters"("hospital_group_id", "counter_type");

-- AddForeignKey
ALTER TABLE "hospital_counters" ADD CONSTRAINT "hospital_counters_hospital_group_id_fkey" FOREIGN KEY ("hospital_group_id") REFERENCES "hospital_groups"("hospital_group_id") ON DELETE SET NULL ON UPDATE CASCADE;
