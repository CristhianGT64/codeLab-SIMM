-- AlterTable
ALTER TABLE "Cai" ADD COLUMN     "id_tipo_documento" BIGINT NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Cai" ADD CONSTRAINT "Cai_id_tipo_documento_fkey" FOREIGN KEY ("id_tipo_documento") REFERENCES "TiposDocumentos"("id_tipo_documento") ON DELETE RESTRICT ON UPDATE CASCADE;
