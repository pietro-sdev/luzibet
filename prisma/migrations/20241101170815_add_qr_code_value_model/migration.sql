-- CreateTable
CREATE TABLE "QRCodeValue" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION DEFAULT 0.0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QRCodeValue_pkey" PRIMARY KEY ("id")
);
