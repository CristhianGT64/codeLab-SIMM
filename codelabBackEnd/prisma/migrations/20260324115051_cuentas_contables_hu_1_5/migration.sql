-- CreateTable
CREATE TABLE "DICC_NATURALEZA_CUENTA" (
    "id_naturaleza" BIGSERIAL NOT NULL,
    "uuid_naturaleza" VARCHAR(64) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DICC_NATURALEZA_CUENTA_pkey" PRIMARY KEY ("id_naturaleza")
);

-- CreateTable
CREATE TABLE "ELEMENTO_CONTABLE" (
    "id_elemento_contable" BIGSERIAL NOT NULL,
    "uuid_elemento_contable" VARCHAR(64) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "codigo_numerico" INTEGER NOT NULL,
    "id_naturaleza" BIGINT NOT NULL,

    CONSTRAINT "ELEMENTO_CONTABLE_pkey" PRIMARY KEY ("id_elemento_contable")
);

-- CreateTable
CREATE TABLE "CLASIFICACION_ELEMENTO_CONTABLE" (
    "id_clasificacion_elemento_contable" BIGSERIAL NOT NULL,
    "uuid_clasificacion_contable" VARCHAR(64) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "codigo_numerico" INTEGER NOT NULL,
    "uuid_elemento_contable" VARCHAR(64) NOT NULL,

    CONSTRAINT "CLASIFICACION_ELEMENTO_CONTABLE_pkey" PRIMARY KEY ("id_clasificacion_elemento_contable")
);

-- CreateTable
CREATE TABLE "CUENTA_CONTABLE" (
    "id_cuenta_contable" BIGSERIAL NOT NULL,
    "uuid_cuenta_contable" VARCHAR(64) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "uuid_elemento_contable" VARCHAR(64) NOT NULL,
    "uuid_clasificacion_contable" VARCHAR(64) NOT NULL,
    "codigo_numerico" INTEGER NOT NULL,

    CONSTRAINT "CUENTA_CONTABLE_pkey" PRIMARY KEY ("id_cuenta_contable")
);

-- CreateTable
CREATE TABLE "SUB_CUENTA_CONTABLE" (
    "id_sub_cuenta_contable" BIGSERIAL NOT NULL,
    "uuid_sub_cuenta_contable" VARCHAR(64) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "uuid_elemento_contable" VARCHAR(64) NOT NULL,
    "uuid_clasificacion_contable" VARCHAR(64) NOT NULL,
    "uuid_cuenta_contable" VARCHAR(64) NOT NULL,
    "codigo_numerico" INTEGER NOT NULL,
    "id_naturaleza" BIGINT NOT NULL,

    CONSTRAINT "SUB_CUENTA_CONTABLE_pkey" PRIMARY KEY ("id_sub_cuenta_contable")
);

-- CreateIndex
CREATE UNIQUE INDEX "DICC_NATURALEZA_CUENTA_uuid_naturaleza_key" ON "DICC_NATURALEZA_CUENTA"("uuid_naturaleza");

-- CreateIndex
CREATE UNIQUE INDEX "ELEMENTO_CONTABLE_uuid_elemento_contable_key" ON "ELEMENTO_CONTABLE"("uuid_elemento_contable");

-- CreateIndex
CREATE INDEX "ELEMENTO_CONTABLE_id_naturaleza_idx" ON "ELEMENTO_CONTABLE"("id_naturaleza");

-- CreateIndex
CREATE UNIQUE INDEX "ELEMENTO_CONTABLE_codigo_numerico_key" ON "ELEMENTO_CONTABLE"("codigo_numerico");

-- CreateIndex
CREATE UNIQUE INDEX "CLASIFICACION_ELEMENTO_CONTABLE_uuid_clasificacion_contable_key" ON "CLASIFICACION_ELEMENTO_CONTABLE"("uuid_clasificacion_contable");

-- CreateIndex
CREATE INDEX "CLASIFICACION_ELEMENTO_CONTABLE_uuid_elemento_contable_idx" ON "CLASIFICACION_ELEMENTO_CONTABLE"("uuid_elemento_contable");

-- CreateIndex
CREATE UNIQUE INDEX "CLASIFICACION_ELEMENTO_CONTABLE_uuid_elemento_contable_codi_key" ON "CLASIFICACION_ELEMENTO_CONTABLE"("uuid_elemento_contable", "codigo_numerico");

-- CreateIndex
CREATE UNIQUE INDEX "CUENTA_CONTABLE_uuid_cuenta_contable_key" ON "CUENTA_CONTABLE"("uuid_cuenta_contable");

-- CreateIndex
CREATE INDEX "CUENTA_CONTABLE_uuid_elemento_contable_idx" ON "CUENTA_CONTABLE"("uuid_elemento_contable");

-- CreateIndex
CREATE INDEX "CUENTA_CONTABLE_uuid_clasificacion_contable_idx" ON "CUENTA_CONTABLE"("uuid_clasificacion_contable");

-- CreateIndex
CREATE UNIQUE INDEX "CUENTA_CONTABLE_uuid_clasificacion_contable_codigo_numerico_key" ON "CUENTA_CONTABLE"("uuid_clasificacion_contable", "codigo_numerico");

-- CreateIndex
CREATE UNIQUE INDEX "SUB_CUENTA_CONTABLE_uuid_sub_cuenta_contable_key" ON "SUB_CUENTA_CONTABLE"("uuid_sub_cuenta_contable");

-- CreateIndex
CREATE INDEX "SUB_CUENTA_CONTABLE_uuid_elemento_contable_idx" ON "SUB_CUENTA_CONTABLE"("uuid_elemento_contable");

-- CreateIndex
CREATE INDEX "SUB_CUENTA_CONTABLE_uuid_clasificacion_contable_idx" ON "SUB_CUENTA_CONTABLE"("uuid_clasificacion_contable");

-- CreateIndex
CREATE INDEX "SUB_CUENTA_CONTABLE_uuid_cuenta_contable_idx" ON "SUB_CUENTA_CONTABLE"("uuid_cuenta_contable");

-- CreateIndex
CREATE INDEX "SUB_CUENTA_CONTABLE_id_naturaleza_idx" ON "SUB_CUENTA_CONTABLE"("id_naturaleza");

-- CreateIndex
CREATE UNIQUE INDEX "SUB_CUENTA_CONTABLE_uuid_cuenta_contable_codigo_numerico_key" ON "SUB_CUENTA_CONTABLE"("uuid_cuenta_contable", "codigo_numerico");

-- AddForeignKey
ALTER TABLE "ELEMENTO_CONTABLE" ADD CONSTRAINT "ELEMENTO_CONTABLE_id_naturaleza_fkey" FOREIGN KEY ("id_naturaleza") REFERENCES "DICC_NATURALEZA_CUENTA"("id_naturaleza") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CLASIFICACION_ELEMENTO_CONTABLE" ADD CONSTRAINT "CLASIFICACION_ELEMENTO_CONTABLE_uuid_elemento_contable_fkey" FOREIGN KEY ("uuid_elemento_contable") REFERENCES "ELEMENTO_CONTABLE"("uuid_elemento_contable") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CUENTA_CONTABLE" ADD CONSTRAINT "CUENTA_CONTABLE_uuid_elemento_contable_fkey" FOREIGN KEY ("uuid_elemento_contable") REFERENCES "ELEMENTO_CONTABLE"("uuid_elemento_contable") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CUENTA_CONTABLE" ADD CONSTRAINT "CUENTA_CONTABLE_uuid_clasificacion_contable_fkey" FOREIGN KEY ("uuid_clasificacion_contable") REFERENCES "CLASIFICACION_ELEMENTO_CONTABLE"("uuid_clasificacion_contable") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SUB_CUENTA_CONTABLE" ADD CONSTRAINT "SUB_CUENTA_CONTABLE_uuid_elemento_contable_fkey" FOREIGN KEY ("uuid_elemento_contable") REFERENCES "ELEMENTO_CONTABLE"("uuid_elemento_contable") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SUB_CUENTA_CONTABLE" ADD CONSTRAINT "SUB_CUENTA_CONTABLE_uuid_clasificacion_contable_fkey" FOREIGN KEY ("uuid_clasificacion_contable") REFERENCES "CLASIFICACION_ELEMENTO_CONTABLE"("uuid_clasificacion_contable") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SUB_CUENTA_CONTABLE" ADD CONSTRAINT "SUB_CUENTA_CONTABLE_uuid_cuenta_contable_fkey" FOREIGN KEY ("uuid_cuenta_contable") REFERENCES "CUENTA_CONTABLE"("uuid_cuenta_contable") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SUB_CUENTA_CONTABLE" ADD CONSTRAINT "SUB_CUENTA_CONTABLE_id_naturaleza_fkey" FOREIGN KEY ("id_naturaleza") REFERENCES "DICC_NATURALEZA_CUENTA"("id_naturaleza") ON DELETE RESTRICT ON UPDATE CASCADE;
