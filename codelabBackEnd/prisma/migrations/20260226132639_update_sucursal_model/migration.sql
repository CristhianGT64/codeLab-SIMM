/*
  Warnings:

  - Added the required column `updatedAt` to the `Sucursal` table without a default value. This is not possible if the table is not empty.
  - Made the column `direccion` on table `Sucursal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefono` on table `Sucursal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gerente` on table `Sucursal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Sucursal` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Sucursal" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "direccion" SET NOT NULL,
ALTER COLUMN "telefono" SET NOT NULL,
ALTER COLUMN "gerente" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
