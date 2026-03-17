-- CreateTable
CREATE TABLE "ConfiguracionContable" (
    "id" BIGSERIAL NOT NULL,
    "metodo_valuacion" "MetodoValuacion" NOT NULL,
    "moneda_funcional" VARCHAR(10) NOT NULL,

    CONSTRAINT "ConfiguracionContable_pkey" PRIMARY KEY ("id")
);
