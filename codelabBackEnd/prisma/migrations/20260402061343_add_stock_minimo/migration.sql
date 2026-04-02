-- DropForeignKey
ALTER TABLE "Cliente" DROP CONSTRAINT "Cliente_tipoClienteId_fkey";

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_tipoClienteId_fkey" FOREIGN KEY ("tipoClienteId") REFERENCES "TipoCliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
