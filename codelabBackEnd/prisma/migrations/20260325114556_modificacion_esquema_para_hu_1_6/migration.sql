/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `DICC_NATURALEZA_CUENTA` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_naturaleza` to the `CUENTA_CONTABLE` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigo` to the `DICC_NATURALEZA_CUENTA` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CUENTA_CONTABLE" ADD COLUMN     "id_naturaleza" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "DICC_NATURALEZA_CUENTA" ADD COLUMN     "codigo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DICC_NATURALEZA_CUENTA_codigo_key" ON "DICC_NATURALEZA_CUENTA"("codigo");
