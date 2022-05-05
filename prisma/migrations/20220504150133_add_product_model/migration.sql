-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "inStock" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL,
    "soldToId" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_soldToId_fkey" FOREIGN KEY ("soldToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
