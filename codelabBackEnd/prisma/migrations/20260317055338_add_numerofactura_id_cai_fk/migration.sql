/*
  Warnings:

  - Added the required column `id_cai` to the `NumeroFactura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NumeroFactura" ADD COLUMN     "id_cai" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "NumeroFactura" ADD CONSTRAINT "NumeroFactura_id_cai_fkey" FOREIGN KEY ("id_cai") REFERENCES "Cai"("id_cai") ON DELETE RESTRICT ON UPDATE CASCADE;
