/*
  Warnings:

  - You are about to drop the `_RolPermiso` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `categoriaId` on table `Permiso` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Permiso" DROP CONSTRAINT "Permiso_categoriaId_fkey";

-- AlterTable
ALTER TABLE "Permiso" ALTER COLUMN "categoriaId" SET NOT NULL;

-- DropTable
DROP TABLE "_RolPermiso";

-- CreateTable
CREATE TABLE "RolPermiso" (
    "rolId" BIGINT NOT NULL,
    "permisoId" BIGINT NOT NULL,

    CONSTRAINT "RolPermiso_pkey" PRIMARY KEY ("rolId","permisoId")
);

-- AddForeignKey
ALTER TABLE "Permiso" ADD CONSTRAINT "Permiso_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaPermiso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolPermiso" ADD CONSTRAINT "RolPermiso_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolPermiso" ADD CONSTRAINT "RolPermiso_permisoId_fkey" FOREIGN KEY ("permisoId") REFERENCES "Permiso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE SET NULL ON UPDATE CASCADE;
