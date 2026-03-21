-- DropIndex
DROP INDEX "periodo_contable_estado_idx";

-- CreateTable
CREATE TABLE "CAI" (
    "id" BIGSERIAL NOT NULL,
    "CAI" VARCHAR(100) NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CAI_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CAI_CAI_key" ON "CAI"("CAI");
