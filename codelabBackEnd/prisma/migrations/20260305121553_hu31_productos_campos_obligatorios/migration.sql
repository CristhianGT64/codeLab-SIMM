/*
  Warnings:

  - Made the column `unidad_medida` on table `Producto` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoriaId` on table `Producto` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_categoriaId_fkey";

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "imagen_url" VARCHAR(255),
ALTER COLUMN "unidad_medida" SET NOT NULL,
ALTER COLUMN "categoriaId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
