/*
  Warnings:

  - A unique constraint covering the columns `[codigo_numerico]` on the table `CUENTA_CONTABLE` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CUENTA_CONTABLE_codigo_numerico_key" ON "CUENTA_CONTABLE"("codigo_numerico");
